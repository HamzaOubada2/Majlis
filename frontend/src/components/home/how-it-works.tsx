'use client';

import { motion } from 'framer-motion';
import { Armchair, CalendarSearch, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';
import { cn } from '@/lib/utils';

const STEPS = [
  { icon: CalendarSearch, title: 'how.step1.title', description: 'how.step1.desc', color: 'from-emerald-700 to-emeralddeep' },
  { icon: Armchair, title: 'how.step2.title', description: 'how.step2.desc', color: 'from-gold to-amber-600' },
  { icon: Users, title: 'how.step3.title', description: 'how.step3.desc', color: 'from-emerald-600 to-emerald-800' },
] as const;

export function HowItWorks() {
  const { t, toDigits } = useI18n();
  return (
    <section className="relative overflow-hidden bg-emeralddeep py-16 text-primary-foreground">
      <div className="pattern-arch absolute inset-0 opacity-30" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100">
            {t('how.badge')}
          </div>
          <h2 className="text-2xl font-black sm:text-3xl">{t('how.title')}</h2>
          <p className="mt-2 text-sm text-emerald-100/80">{t('how.subtitle')}</p>
        </motion.div>

        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          {/* connector line */}
          <div className="absolute inset-x-16 top-10 hidden h-0.5 bg-gradient-to-r from-emerald-700 via-gold/60 to-emerald-700 md:block" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col items-center gap-4 text-center"
            >
              <div className="relative">
                <span className="absolute -inset-2 animate-pulse-ring rounded-2xl bg-white/10" />
                <div className={cn('relative grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br text-primary-foreground shadow-xl', step.color)}>
                  <step.icon className="h-9 w-9" />
                </div>
                <span className="absolute -top-2 -end-2 grid h-7 w-7 place-items-center rounded-full bg-gold text-xs font-black text-gold-foreground shadow">
                  {toDigits(i + 1)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black">{t(step.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-emerald-100/85">
                  {t(step.description)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}