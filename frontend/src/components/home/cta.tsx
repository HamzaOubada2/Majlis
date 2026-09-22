'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n-provider';

export function CtaBand() {
  const { t } = useI18n();
  return (
    <section className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="bg-mesh relative overflow-hidden rounded-3xl bg-gradient-to-l from-emeralddeep via-primary to-emerald-800 px-6 py-14 text-center text-primary-foreground shadow-glow sm:px-12"
      >
        <div className="pattern-arch absolute inset-0 opacity-30" />
        <div className="pointer-events-none absolute -top-20 end-10 h-52 w-52 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur">
            <BookOpen className="h-7 w-7 text-gold" />
          </div>
          <h2 className="text-balance text-2xl font-black leading-snug sm:text-3xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-emerald-100/85 sm:text-base">
            {t('cta.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" variant="gold" asChild>
              <Link href="/seminars">
                {t('cta.start')}
                <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/25 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
            >
              <Link href="/scholars">{t('cta.scholars')}</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}