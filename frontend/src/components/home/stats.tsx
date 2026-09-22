'use client';

import { motion } from 'framer-motion';
import { CalendarCheck2, GraduationCap, Users } from 'lucide-react';
import { useSeminars, useScholars } from '@/lib/hooks';
import { bookedSeatsCount } from '@/lib/format';
import { useI18n } from '@/lib/i18n-provider';
import { AnimatedCounter } from '@/components/shared/animated-counter';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  sub?: string;
  accent?: boolean;
}

function StatItem({ icon: Icon, value, label, sub, accent }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex items-center gap-4 rounded-2xl border p-5',
        accent
          ? 'border-gold/30 bg-gradient-to-br from-gold/10 to-amber-100/40 dark:to-amber-500/10'
          : 'border-border bg-card',
      )}
    >
      <div className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-xl', accent ? 'bg-gold text-gold-foreground' : 'bg-primary/10 text-primary')}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-3xl font-black text-foreground">
          <AnimatedCounter target={value} />
        </div>
        <p className="text-sm font-bold text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground/80">{sub}</p>}
      </div>
    </motion.div>
  );
}

export function Stats() {
  const { data: seminars, isLoading: seminarsLoading } = useSeminars();
  const { data: scholars, isLoading: scholarsLoading } = useScholars();
  const { t } = useI18n();

  const totalSeminarCount = seminars?.length ?? 0;
  const totalScholarCount = scholars?.length ?? 0;
  const totalBookedSeats =
    seminars?.reduce((sum, s) => sum + bookedSeatsCount(s), 0) ?? 0;

  if (seminarsLoading || scholarsLoading) {
    return (
      <section className="border-y border-border/50 bg-secondary/40">
        <div className="container grid gap-4 py-10 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-border/50 bg-secondary/40">
      <div className="container grid gap-4 py-10 sm:grid-cols-3">
        <StatItem
          icon={CalendarCheck2}
          value={totalSeminarCount}
          label={t('stats.seminars')}
          sub={t('stats.seminarsSub')}
        />
        <StatItem
          icon={GraduationCap}
          value={totalScholarCount}
          label={t('stats.scholars')}
          sub={t('stats.scholarsSub')}
        />
        <StatItem
          icon={Users}
          value={totalBookedSeats}
          label={t('stats.seats')}
          sub={t('stats.seatsSub')}
          accent
        />
      </div>
    </section>
  );
}