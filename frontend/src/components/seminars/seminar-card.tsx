'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SeatProgress } from '@/components/shared/seat-progress';
import { BookSeatDialog } from '@/components/seminars/book-seat-dialog';
import { getInitials, isUpcoming } from '@/lib/format';
import { useI18n } from '@/lib/i18n-provider';
import type { Seminar } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SeminarCardProps {
  seminar: Seminar;
  featured?: boolean;
}

export function SeminarCard({ seminar, featured = false }: SeminarCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t, toDigits, formatDate, formatTime } = useI18n();
  const remaining = Math.max(0, Number(seminar.availableSeats) || 0);
  const soldOut = remaining === 0;
  const upcoming = isUpcoming(seminar.eventDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="h-full"
    >
      <Card
        className={cn(
          'card-hover group flex h-full flex-col overflow-hidden',
          featured && 'ring-1 ring-primary/10',
        )}
      >
        <div className="relative overflow-hidden bg-gradient-to-l from-emeralddeep via-primary to-emerald-700 p-5 text-primary-foreground">
          <div className="pattern-arch absolute inset-0 opacity-40" />
          <div className="relative flex items-center justify-between gap-3">
            {seminar.scholar ? (
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-11 w-11 border-2 border-gold/60">
                  <AvatarFallback className="bg-white/15 text-primary-foreground">
                    {getInitials(seminar.scholar.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{seminar.scholar.name}</p>
                  {seminar.scholar.specialization && (
                    <p className="truncate text-xs text-emerald-100">
                      {seminar.scholar.specialization}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-sm font-bold">{t('card.unknownLecturer')}</span>
            )}

            {soldOut ? (
              <Badge variant="destructive" className="shrink-0 bg-white/10 text-red-200 ring-1 ring-red-300/30">
                {t('card.full')}
              </Badge>
            ) : (
              <Badge className="shrink-0 bg-gold text-gold-foreground shadow-sm">
                {t('card.remaining', { n: toDigits(remaining) })}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <Link href={`/seminars/${seminar.id}`} className="group/title mt-1 block">
            <h3 className="text-base font-extrabold leading-snug text-foreground transition-colors group-hover/title:text-primary">
              {seminar.title}
            </h3>
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{formatDate(seminar.eventDate)}</span>
              <span className="text-border">|</span>
              <span>{formatTime(seminar.eventDate)}</span>
            </span>
            {!upcoming && (
              <Badge variant="outline" className="text-[10px]">
                {t('card.ended')}
              </Badge>
            )}
          </div>

          <div className="mt-2 inline-flex max-w-full items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span className="truncate font-semibold">{seminar.location}</span>
          </div>

          <div className="mt-auto pt-4">
            <SeatProgress seminar={seminar} size="sm" />
          </div>

          <div className="mt-5 flex gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <Link href={`/seminars/${seminar.id}`}>
                {t('card.details')}
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              variant="gold"
              size="sm"
              className="flex-1"
              disabled={soldOut || !upcoming}
              onClick={() => setDialogOpen(true)}
            >
              {soldOut ? t('card.soldOut') : upcoming ? t('card.book') : t('card.ended')}
            </Button>
          </div>
        </div>
      </Card>

      <BookSeatDialog seminar={seminar} open={dialogOpen} onOpenChange={setDialogOpen} />
    </motion.div>
  );
}