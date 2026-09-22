'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BookOpenText, Landmark, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { useI18n } from '@/lib/i18n-provider';

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const QUOTES = [
  { text: 'shell.quote1', source: 'shell.quote1Source' },
  { text: 'shell.quote2', source: 'shell.quote2Source' },
] as const;

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  const { t } = useI18n();
  const quote = QUOTES[0];

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center bg-background px-5 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 md:hidden">
            <div className="[&_*]:!text-primary">
              <Logo />
            </div>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-black text-primary">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {t('shell.welcome')}
          </div>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </motion.div>
      </div>

      {/* Illustration / quote side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-emeralddeep via-primary to-emerald-800 text-primary-foreground lg:block">
        <div className="pattern-arch absolute inset-0 opacity-30" />
        <div className="pointer-events-none absolute -bottom-24 -start-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 end-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="[&_*]:!text-primary-foreground">
            <Logo />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-8"
          >
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 backdrop-blur">
              <BookOpenText className="h-8 w-8 text-gold" />
            </div>
            <blockquote className="max-w-md text-2xl font-bold leading-relaxed">
              «{t(quote.text)}»
            </blockquote>
            <p className="text-sm font-semibold text-emerald-100/80">— {t(quote.source)}</p>
          </motion.div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
              <p className="text-sm font-semibold text-emerald-100/90">
                {t('shell.security')}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <Landmark className="h-5 w-5 shrink-0 text-gold" />
              <p className="text-sm font-semibold text-emerald-100/90">
                {t('shell.join')}
              </p>
            </div>
            <p className="pt-2 text-center text-xs text-emerald-100/60">
              <Link href="/" className="font-bold text-emerald-100/90 underline-offset-4 hover:underline">
                {t('shell.backHome')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}