'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Armchair,
  BadgeCheck,
  CalendarDays,
  CalendarClock,
  CalendarX2,
  LogIn,
  MapPin,
  Shield,
  Ticket,
  UserRound,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/lib/auth-provider';
import { useCancelReservation, useMyReservations } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import { EmptyState } from '@/components/shared/empty-state';
import { getUserInitials, getUserName, isUpcoming } from '@/lib/format';
import type { Reservation } from '@/lib/types';

function ReservationsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-36 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function ProfileDashboard() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="container py-12">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="bg-mesh relative overflow-hidden rounded-3xl bg-gradient-to-l from-emeralddeep via-primary to-emerald-700 p-8 text-primary-foreground sm:p-10">
          <div className="pattern-arch absolute inset-0 opacity-30" />
          <div className="relative flex flex-wrap items-center gap-5">
            <Avatar className="h-20 w-20 border-2 border-gold/60 shadow-lg">
              <AvatarFallback className="bg-white/15 text-2xl text-primary-foreground">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black sm:text-3xl">{getUserName(user)}</h1>
              <p className="mt-1 text-sm text-emerald-100/85" dir="ltr">
                {user?.email}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="bg-gold text-gold-foreground">
                  {user?.role === 'ADMIN' ? t('profile.roleAdmin') : t('profile.roleAttendee')}
                </Badge>
                <Badge variant="outline" className="border-white/25 bg-white/10 text-primary-foreground">
                  <Shield className="h-3 w-3" />
                  {t('profile.verified')}
                </Badge>
              </div>
            </div>
            <div className="hidden w-full max-w-xs items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur md:flex">
              <Ticket className="h-6 w-6 shrink-0 text-gold" />
              <p className="text-xs font-semibold text-emerald-100/90">
                {t('profile.ticketHint')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="reservations">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reservations">
            <CalendarClock className="h-4 w-4" />
            {t('profile.tabReservations')}
          </TabsTrigger>
          <TabsTrigger value="account">
            <UserRound className="h-4 w-4" />
            {t('profile.tabAccount')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reservations">
          <MyReservations />
        </TabsContent>

        <TabsContent value="account">
          <AccountInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MyReservations() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError } = useMyReservations(isAuthenticated);
  const { t } = useI18n();

  const upcoming = (data ?? []).filter((r) => isUpcoming(r.seminar.eventDate));
  const attended = (data ?? []).filter((r) => !isUpcoming(r.seminar.eventDate));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <ReservationStat icon={Ticket} label={t('profile.total')} value={data?.length ?? 0} />
        <ReservationStat icon={CalendarClock} label={t('profile.upcoming')} value={upcoming.length} />
        <ReservationStat icon={CalendarX2} label={t('profile.ended')} value={attended.length} accent />
      </div>

      {isLoading ? (
        <ReservationsSkeleton />
      ) : isError ? (
        <EmptyState
          icon={LogIn}
          title={t('empty.loadReservations')}
          description={t('empty.loadReservationsDesc')}
        />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Armchair}
          title={t('empty.noReservations')}
          description={t('empty.noReservationsDesc')}
          action={
            <Button asChild>
              <Link href="/seminars">{t('profile.browseSeminars')}</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {data.map((reservation, i) => (
            <ReservationRow key={reservation.id} reservation={reservation} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReservationStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent?: boolean;
}) {
  const { toDigits } = useI18n();
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 ${
        accent ? 'border-gold/30 bg-gold/10' : 'border-border bg-card'
      }`}
    >
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent ? 'bg-gold text-gold-foreground' : 'bg-primary/10 text-primary'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xl font-black leading-none">{toDigits(value)}</div>
        <div className="text-xs font-bold text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function ReservationRow({ reservation, index }: { reservation: Reservation; index: number }) {
  const cancel = useCancelReservation();
  const { seminar } = reservation;
  const upcoming = isUpcoming(seminar.eventDate);
  const { t, formatDate, formatTime } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">
                <BadgeCheck className="h-3 w-3" />
                {reservation.status === 'CONFIRMED' ? t('profile.confirmed') : reservation.status === 'CANCELLED' ? t('profile.cancelled') : reservation.status}
              </Badge>
              {upcoming ? (
                <Badge variant="soft">{t('profile.upcoming')}</Badge>
              ) : (
                <Badge variant="outline">{t('profile.ended')}</Badge>
              )}
            </div>
            <Link
              href={`/seminars/${seminar.id}`}
              className="mt-2 block text-lg font-black text-foreground transition-colors hover:text-primary"
            >
              {seminar.title}
            </Link>
            {seminar.scholar && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary">
                <UserRound className="h-3.5 w-3.5" />
                {seminar.scholar.name}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-gold" />
                {formatDate(seminar.eventDate)} — {formatTime(seminar.eventDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {seminar.location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:flex-col">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/seminars/${seminar.id}`}>{t('card.details')}</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  {t('profile.cancelBooking')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('profile.cancelTitle')}</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2 pt-2">
                    <p>
                      {t('profile.cancelDesc1')}
                    </p>
                    <p className="rounded-xl bg-secondary p-3 text-sm font-bold text-foreground">
                      {seminar.title}
                    </p>
                    <p>
                      {t('profile.cancelDesc2')}
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('profile.back')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      cancel.mutate(reservation.id);
                    }}
                    disabled={cancel.isPending}
                  >
                    {cancel.isPending ? t('profile.cancelling') : t('profile.confirmCancel')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function AccountInfo() {
  const { user } = useAuth();
  const { t } = useI18n();
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="max-w-xl p-6">
        <h2 className="text-lg font-black">{t('profile.accountTitle')}</h2>
        <Separator className="my-4" />
        <dl className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="font-bold text-muted-foreground">{t('profile.fullName')}</dt>
            <dd className="font-black">{getUserName(user)}</dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="font-bold text-muted-foreground">{t('profile.email')}</dt>
            <dd className="font-black" dir="ltr">{user?.email}</dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="font-bold text-muted-foreground">{t('profile.role')}</dt>
            <dd>
              <Badge variant="soft">{user?.role === 'ADMIN' ? t('profile.roleAdmin') : t('profile.roleAttendee')}</Badge>
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="font-bold text-muted-foreground">{t('profile.id')}</dt>
            <dd className="max-w-[220px] truncate text-xs text-muted-foreground" dir="ltr">
              {user?.id}
            </dd>
          </div>
        </dl>
      </Card>
    </motion.div>
  );
}