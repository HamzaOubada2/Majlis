'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/lib/i18n-provider';
import { cn } from '@/lib/utils';

export function FullPageLoader({ label }: { label?: string }) {
  const { t } = useI18n();
  const text = label ?? t('common.loading');
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <motion.div
        className="relative h-16 w-16"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold" />
      </motion.div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function SeminarCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="mt-4 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-2/3" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-4 h-2 w-full" />
      <Skeleton className="mt-5 h-10 w-full" />
    </div>
  );
}

export function CardsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3')}>
      {Array.from({ length: count }).map((_, i) => (
        <SeminarCardSkeleton key={i} />
      ))}
    </div>
  );
}