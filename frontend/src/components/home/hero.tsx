'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSeminars } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import { normalizeCapacity } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export function Hero() {
  const { data: seminars, isLoading } = useSeminars();
  const { t, toDigits, formatDate, formatTime } = useI18n();
  const next = seminars?.find((s) => new Date(s.eventDate).getTime() > Date.now());

  return (
    <section className="bg-mesh relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 start-[-10%] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-24 end-[-8%] h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

      <div className="container grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-start">
          <motion.div variants={item}>
            <Badge variant="soft" className="mb-5 gap-1.5 px-3.5 py-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              {t('hero.badge')}
              <BadgeCheck className="ms-1 h-3.5 w-3.5 text-primary" />
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-black leading-[1.25] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]"
          >
            {t('hero.title1')}
            <span className="text-gradient-emerald block">{t('hero.title2')}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0 sm:text-lg"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Button size="lg" variant="gold" asChild className="shadow-glow-gold">
              <Link href="/seminars">
                {t('hero.explore')}
                <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">{t('account.login')}</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-muted-foreground lg:justify-start"
          >
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-gold" />
              {t('hero.freeBooking')}
            </span>
          </motion.div>
        </motion.div>

        {/* Floating ticket card */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="animate-float">
            {isLoading || !next ? (
              <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-2xl">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-card p-6 shadow-2xl shadow-emerald-900/20">
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-l from-gold via-emerald-600 to-primary" />
                <div className="flex items-center justify-between">
                  <Badge variant="gold">{t('hero.nearestSeminar')}</Badge>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {t('hero.seats', { n: toDigits(normalizeCapacity(next.capacity)) })}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black leading-snug">{next.title}</h3>
                {next.scholar && (
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {next.scholar.name}
                    {next.scholar.specialization && (
                      <span className="text-muted-foreground"> · {next.scholar.specialization}</span>
                    )}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-gold" />
                    {formatDate(next.eventDate)} — {formatTime(next.eventDate)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gold" />
                    {next.location}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="absolute -bottom-5 -start-3 hidden rotate-[-6deg] rounded-2xl border border-gold/30 bg-card/90 px-4 py-2.5 text-sm font-black text-primary shadow-lg backdrop-blur sm:block">
            {t('hero.seatBooked')}
          </div>
          <div className="absolute -end-4 -top-4 hidden rotate-6 rounded-2xl border bg-emeralddeep px-4 py-2.5 text-sm font-black text-primary-foreground shadow-lg sm:block">
            {t('hero.distinguished')}
          </div>
        </motion.div>
      </div>
    </section>
  );
}