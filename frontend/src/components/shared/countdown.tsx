'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { timeUntil } from '@/lib/format';
import { useI18n } from '@/lib/i18n-provider';
import { cn } from '@/lib/utils';

interface CountdownProps {
  date: string;
  className?: string;
  compact?: boolean;
}

export function Countdown({ date, className, compact = false }: CountdownProps) {
  const { t, toDigits } = useI18n();
  const [tick, setTick] = useState(() => timeUntil(date));

  useEffect(() => {
    const id = setInterval(() => setTick(timeUntil(date)), 1000);
    return () => clearInterval(id);
  }, [date]);

  const pad = (n: number) => toDigits(n.toString().padStart(2, '0'));

  if (tick.finished) {
    return (
      <div className={cn('inline-flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-bold text-destructive', className)}>
        <Clock className="h-4 w-4" />
        {t('countdown.started')}
      </div>
    );
  }

  const cells = [
    { value: pad(tick.days), label: t('countdown.days') },
    { value: pad(tick.hours), label: t('countdown.hours') },
    { value: pad(tick.minutes), label: t('countdown.minutes') },
    { value: pad(tick.seconds), label: t('countdown.seconds') },
  ];

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Clock className="h-4 w-4 text-gold" />
        <span className="text-sm font-bold text-primary">
          {tick.days > 0 ? t('countdown.compactDays', { n: toDigits(tick.days) }) : `${pad(tick.hours)}:${pad(tick.minutes)}:${pad(tick.seconds)}`}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {cells.map((cell, i) => (
        <div key={cell.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <motion.div
              key={cell.value}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-emeralddeep to-primary text-lg font-black text-primary-foreground shadow-md shadow-emerald-900/20"
            >
              {cell.value}
            </motion.div>
            <span className="mt-1 text-[11px] font-semibold text-muted-foreground">
              {cell.label}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span className="mb-4 text-lg font-bold text-gold">:</span>
          )}
        </div>
      ))}
    </div>
  );
}