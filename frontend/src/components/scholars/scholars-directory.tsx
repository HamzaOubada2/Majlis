'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, GraduationCap, Quote, ScrollText } from 'lucide-react';
import { useSeminars, useScholars } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton, } from '@/components/ui/skeleton';
import { getInitials, isUpcoming } from '@/lib/format';

function ScholarCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-16 w-full" />
      <Skeleton className="mt-4 h-4 w-1/2" />
    </Card>
  );
}

export function ScholarsDirectory() {
  const { data: scholars, isLoading: scholarsLoading, isError } = useScholars();
  const { data: seminars, isLoading: seminarsLoading } = useSeminars();
  const { t, toDigits, formatDate } = useI18n();

  const scholarUpcomingSeminars = (scholarId: string) =>
    (seminars ?? [])
      .filter(
        (s) =>
          s.scholarId === scholarId &&
          isUpcoming(s.eventDate),
      )
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  if (isError) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={GraduationCap}
          title={t('empty.loadScholars')}
          description={t('empty.loadScholarsDesc')}
        />
      </div>
    );
  }

  return (
    <section className="container py-12">
      <div className="mb-10">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-black text-gold">
          <GraduationCap className="h-3.5 w-3.5" />
          {t('scholars.badge')}
        </div>
        <h1 className="text-3xl font-black sm:text-4xl">{t('scholars.title')}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t('scholars.subtitle')}
        </p>
      </div>

      {scholarsLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ScholarCardSkeleton key={i} />
          ))}
        </div>
      ) : !scholars || scholars.length === 0 ? (
        <EmptyState
          icon={Quote}
          title={t('empty.noScholars')}
          description={t('empty.noScholarsDesc')}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scholars.map((scholar, idx) => {
            const upcoming = scholarUpcomingSeminars(scholar.id);
            return (
              <motion.div
                key={scholar.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.06, 0.4) }}
              >
                <Card className="card-hover flex h-full flex-col p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-gold/50 shadow-md">
                      <AvatarFallback className="text-xl">
                        {getInitials(scholar.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black">{scholar.name}</h2>
                      {scholar.specialization && (
                        <Badge variant="soft" className="mt-1.5">
                          {scholar.specialization}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {scholar.bio && (
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {scholar.bio}
                    </p>
                  )}

                  <div className="mt-auto pt-4">
                    <div className="rounded-xl bg-secondary/50 p-3.5">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-black text-primary">
                        <CalendarDays className="h-3.5 w-3.5 text-gold" />
                        {seminarsLoading
                          ? t('common.loading')
                          : upcoming.length > 0
                            ? t('scholars.upcomingCount', { n: toDigits(upcoming.length) })
                            : t('scholars.noUpcoming')}
                      </p>
                      {upcoming.length > 0 && (
                        <ul className="space-y-1.5">
                          {upcoming.slice(0, 2).map((s) => (
                            <li key={s.id}>
                              <Link
                                href={`/seminars/${s.id}`}
                                className="block truncate text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
                              >
                                {s.title} — {formatDate(s.eventDate)}
                              </Link>
                            </li>
                          ))}
                          {upcoming.length > 2 && (
                            <li className="text-[11px] font-bold text-muted-foreground">
                              ... {t('scholars.more', { n: toDigits(upcoming.length - 2) })}
                            </li>
                          )}
                        </ul>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full"
                      asChild
                    >
                      <Link href={`/seminars?q=${encodeURIComponent(scholar.name)}`}>
                        <ScrollText className="h-4 w-4 text-primary" />
                        {t('scholars.viewSeminars')}
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}