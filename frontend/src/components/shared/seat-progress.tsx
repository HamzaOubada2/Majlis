'use client';

import { cn } from '@/lib/utils';
import { bookableProgress, normalizeCapacity } from '@/lib/format';
import { useI18n } from '@/lib/i18n-provider';
import type { Seminar } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface SeatProgressProps {
  seminar: Seminar;
  className?: string;
  label?: boolean;
  size?: 'sm' | 'md';
}

export function SeatProgress({ seminar, className, label = true, size = 'md' }: SeatProgressProps) {
  const { t, toDigits } = useI18n();
  const remaining = Math.max(0, Number(seminar.availableSeats) || 0);
  const capacity = normalizeCapacity(seminar.capacity);
  const progress = bookableProgress(seminar);
  const soldOut = remaining === 0;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className={cn(soldOut ? 'text-destructive' : 'text-muted-foreground')}>
            {soldOut ? (
              t('seat.full')
            ) : (
              <>
                {t('seat.remaining', {
                  n: toDigits(remaining),
                  m: toDigits(capacity),
                })}
              </>
            )}
          </span>
          <span className={cn('font-bold', soldOut ? 'text-destructive' : 'text-primary')}>
            {soldOut ? t('seat.fullShort') : t('seat.percent', { n: toDigits(progress) })}
          </span>
        </div>
      )}
      <Progress
        value={soldOut ? 0 : progress}
        className={cn(
          'bg-secondary',
          soldOut
            ? '[&>div]:bg-destructive'
            : progress <= 30
              ? '[&>div]:bg-amber-500'
              : '[&>div]:bg-emerald-600',
          size === 'sm' && 'h-1.5',
        )}
      />
    </div>
  );
}