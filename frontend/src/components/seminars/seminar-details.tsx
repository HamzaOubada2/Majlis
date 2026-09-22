'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpenText,
  CalendarDays,
  GraduationCap,
  MapPin,
  MapPinned,
} from 'lucide-react';
import { useSeminars, useSeminar } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { ReservationWidget } from '@/components/seminars/reservation-widget';
import { SeminarCard } from '@/components/seminars/seminar-card';
import { getInitials, isUpcoming, normalizeCapacity } from '@/lib/format';

function DetailSkeleton() {
  return (
    <div className="container grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  );
}

export function SeminarDetails() {
  const params = useParams<{ id: string }>();
  const { data: seminar, isLoading, isError } = useSeminar(params.id);
  const { data: seminars } = useSeminars();
  const { t, toDigits, formatDate, remainingLabel } = useI18n();

  if (isLoading) return <DetailSkeleton />;

  if (isError || !seminar) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={BookOpenText}
          title={t('details.notFound')}
          description={t('details.notFoundDesc')}
          action={
            <Button asChild>
              <Link href="/seminars">{t('details.back')}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const upcoming = isUpcoming(seminar.eventDate);
  const soldOut = Number(seminar.availableSeats) <= 0;

  const related = (seminars ?? [])
    .filter(
      (s) =>
        s.id !== seminar.id && (s.scholarId === seminar.scholarId || s.scholar?.id === seminar.scholar?.id),
    )
    .slice(0, 3);

  return (
    <div>
      {/* Header banner */}
      <section className="bg-mesh relative overflow-hidden border-b border-border/60">
        <div className="container grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <Link
              href="/seminars"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-emerald-800"
            >
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              {t('details.back')}
            </Link>

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {upcoming ? (
                  <Badge variant="success">
                    {soldOut ? t('card.full') : t('details.available')}
                  </Badge>
                ) : (
                  <Badge variant="outline">{t('details.ended')}</Badge>
                )}
                <Badge variant="soft">
                  {remainingLabel(seminar.eventDate)}
                </Badge>
              </div>
              <h1 className="text-balance text-3xl font-black leading-snug sm:text-4xl">
                {seminar.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-gold" />
                {formatDate(seminar.eventDate)}
              </p>
            </div>

            {seminar.scholar && (
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <Avatar className="h-14 w-14 border-2 border-gold/50">
                  <AvatarFallback className="text-lg">
                    {getInitials(seminar.scholar.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-black">{seminar.scholar.name}</p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    {seminar.scholar.specialization ?? t('details.scholar')}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/scholars`}>{t('details.viewScholar')}</Link>
                </Button>
              </div>
            )}

            {seminar.description && (
              <div className="rounded-2xl bg-card/60 p-5">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-black text-primary">
                  <BookOpenText className="h-4 w-4" />
                  {t('details.about')}
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {seminar.description}
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ReservationWidget seminar={seminar} />
          </motion.div>
        </div>
      </section>

      {/* Location + capacity strip */}
      <section className="container py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="pattern-arch relative grid min-h-52 place-items-center bg-gradient-to-br from-emerald-50 to-secondary">
              <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                  <MapPin className="h-7 w-7 text-gold" />
                </div>
                <div>
                  <p className="font-black text-foreground">{seminar.location}</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {t('details.mapHint')}
                  </p>
                </div>
              </div>
              <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-card/80 px-2.5 py-1 text-[11px] font-bold text-primary backdrop-blur">
                <MapPinned className="h-3 w-3" />
                {t('details.accessInstructions')}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border px-5 py-4 text-sm font-bold text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Award className="h-4 w-4 text-gold" />
                {t('details.totalCapacity', { n: toDigits(normalizeCapacity(seminar.capacity)) })}
              </span>
              <span className="inline-flex items-center gap-2">
                {t('details.booked', { n: toDigits(normalizeCapacity(seminar.capacity) - Number(seminar.availableSeats)) })}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-black text-primary">
                <MapPinned className="h-4 w-4 text-gold" />
                {t('details.entryInfo')}
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {t('details.arriveEarly')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {t('details.showTicket')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {t('details.cancelPolicy')}
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-l from-emeralddeep to-primary p-5 text-primary-foreground">
              <p className="text-sm font-black">{t('details.shareTitle')}</p>
              <p className="mt-1 text-xs leading-relaxed text-emerald-100/80">
                {t('details.shareText')}
              </p>
            </div>
          </motion.div>
        </div>

        <Separator className="mt-12" />

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-black">{t('details.related')}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <SeminarCard key={s.id} seminar={s} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}