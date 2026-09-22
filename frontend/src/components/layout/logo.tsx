'use client';

import Link from 'next/link';
import { Landmark } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = '/' }: LogoProps) {
  const { t } = useI18n();
  return (
    <Link
      href={href}
      className={cn('group flex items-center gap-2.5', className)}
      aria-label={t('logo.aria')}
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emeralddeep text-primary-foreground shadow-md shadow-emerald-900/20 transition-transform duration-300 group-hover:scale-105">
        <Landmark className="h-5 w-5" />
        <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-background" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-primary">مجلس</span>
        <span className="text-[10px] font-semibold text-muted-foreground">{t('logo.tagline')}</span>
      </span>
    </Link>
  );
}