'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarPlus,
  CalendarDays,
  GraduationCap,
  Percent,
  Plus,
  RefreshCcw,
  UserRound,
  Users,
} from 'lucide-react';
import { useAdminOverview } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  accent?: 'primary' | 'gold';
  delay?: number;
}

function StatCard({ icon: Icon, label, value, hint, accent = 'primary', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="flex items-center gap-4 p-5">
        <div
          className={cn(
            'grid h-14 w-14 shrink-0 place-items-center rounded-2xl',
            accent === 'gold' ? 'bg-gold/15 text-gold' : 'bg-primary/10 text-primary',
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <div className="text-3xl font-black leading-none">{value}</div>
          <div className="mt-1.5 text-sm font-bold text-muted-foreground">{label}</div>
          {hint && <div className="mt-0.5 text-xs text-muted-foreground/80">{hint}</div>}
        </div>
      </Card>
    </motion.div>
  );
}

function StatSkeleton() {
  return (
    <Skeleton className="flex h-[110px] w-full items-center gap-4 rounded-2xl p-5">
      <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
      <div className="w-full space-y-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-3.5 w-28" />
      </div>
    </Skeleton>
  );
}

export function OverviewDashboard() {
  const { data, isLoading, isError, refetch } = useAdminOverview();
  const { t, toDigits } = useI18n();

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      ) : isError || !data ? (
        <EmptyState
          icon={RefreshCcw}
          title={t('admin.loadFailed')}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4" />
              {t('admin.save')}
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Users}
              label={t('admin.statTotalUsers')}
              value={toDigits(data.totalUsers)}
            />
            <StatCard
              icon={CalendarDays}
              label={t('admin.statActiveSeminars')}
              value={toDigits(data.activeSeminars)}
              hint={t('admin.statTotalSeminars') + ': ' + toDigits(data.totalSeminars)}
              delay={0.05}
            />
            <StatCard
              icon={GraduationCap}
              label={t('admin.statTotalScholars')}
              value={toDigits(data.totalScholars)}
              delay={0.1}
            />
            <StatCard
              icon={Percent}
              label={t('admin.statReservationPercentage')}
              value={`${toDigits(data.reservationPercentage)}%`}
              hint={`${toDigits(data.totalBookedSeats)} / ${toDigits(data.totalCapacity)}`}
              accent="gold"
              delay={0.15}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat label={t('admin.statTotalSeminars')} value={toDigits(data.totalSeminars)} icon={CalendarDays} />
            <MiniStat label={t('admin.statBookedSeats')} value={toDigits(data.totalBookedSeats)} icon={UserRound} />
            <MiniStat label={t('admin.statConfirmed')} value={toDigits(data.confirmedReservations)} icon={Users} gold />
            <MiniStat label={t('admin.statCancelled')} value={toDigits(data.cancelledReservations)} icon={Users} muted />
          </div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-black">{t('admin.quickActions')}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" asChild>
              <Link href="/admin/seminars?new=1">
                <CalendarPlus className="h-4 w-4" />
                {t('admin.addSeminar')}
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/admin/scholars?new=1">
                <Plus className="h-4 w-4" />
                {t('admin.addScholar')}
              </Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  gold,
  muted,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  gold?: boolean;
  muted?: boolean;
}) {
  return (
    <Card className="flex items-center justify-between gap-3 px-5 py-4">
      <div>
        <div className="text-xl font-black leading-none">{value}</div>
        <div className="mt-1 text-xs font-bold text-muted-foreground">{label}</div>
      </div>
      <div
        className={cn(
          'grid h-10 w-10 place-items-center rounded-xl',
          gold ? 'bg-gold/15 text-gold' : muted ? 'bg-secondary text-muted-foreground' : 'bg-primary/10 text-primary',
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
}