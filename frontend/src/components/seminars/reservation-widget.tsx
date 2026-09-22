'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Armchair, CalendarDays, LogIn, MapPin, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Countdown } from '@/components/shared/countdown';
import { SeatProgress } from '@/components/shared/seat-progress';
import { BookSeatDialog } from '@/components/seminars/book-seat-dialog';
import { useAuth } from '@/lib/auth-provider';
import { useI18n } from '@/lib/i18n-provider';
import { isUpcoming } from '@/lib/format';
import type { Seminar } from '@/lib/types';

export function ReservationWidget({ seminar }: { seminar: Seminar }) {
  const { isAuthenticated } = useAuth();
  const { t, toDigits, formatDateTime } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const remaining = Math.max(0, Number(seminar.availableSeats) || 0);
  const soldOut = remaining === 0;
  const upcoming = isUpcoming(seminar.eventDate);

  const handleBook = () => {
    if (!isAuthenticated) {
      router.push(`/login?next=/seminars/${seminar.id}`);
      return;
    }
    setOpen(true);
  };

  return (
    <Card className="sticky top-24 overflow-hidden">
      <div className="bg-gradient-to-l from-emerald-700 to-emeralddeep p-5 text-primary-foreground">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-black">
            <Armchair className="h-4 w-4 text-gold" />
            {t('widget.title')}
          </span>
          <Badge
            variant={soldOut ? 'destructive' : upcoming ? 'success' : 'outline'}
            className={soldOut || !upcoming ? 'bg-white/10' : 'bg-white/10'}
          >
            {soldOut ? t('card.full') : upcoming ? t('widget.available') : t('widget.ended')}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        {upcoming ? (
          <div className="mb-5 rounded-xl bg-secondary/60 p-4">
            <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-black text-gold">
              <Timer className="h-3.5 w-3.5" />
              {t('widget.countdownLabel')}
            </p>
            <Countdown date={seminar.eventDate} compact />
          </div>
        ) : (
          <div className="mb-5 rounded-xl bg-destructive/10 p-4 text-center text-sm font-bold text-destructive">
            {t('widget.endedMsg')}
          </div>
        )}

        <div className="flex items-center justify-between text-sm font-bold">
          <span className="text-muted-foreground">{t('widget.availableSeats')}</span>
          <span className="text-xl font-black text-primary">
            {toDigits(remaining)}
            <span className="ms-1 text-sm font-bold text-muted-foreground">
              / {toDigits(Number(seminar.capacity) || 0)}
            </span>
          </span>
        </div>

        <SeatProgress seminar={seminar} className="mt-2" label={false} />

        <Separator className="my-5" />

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="flex items-start gap-2.5">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="font-semibold text-foreground">
              {formatDateTime(seminar.eventDate)}
            </span>
          </p>
          <p className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span className="font-semibold text-foreground">{seminar.location}</span>
          </p>
        </div>

        <motion.div whileTap={{ scale: 0.98 }} className="mt-6">
          <Button
            variant={soldOut ? 'outline' : 'gold'}
            size="lg"
            className="w-full"
            disabled={soldOut || !upcoming}
            onClick={handleBook}
          >
            {soldOut ? (
              t('widget.soldOutMsg')
            ) : upcoming ? (
              isAuthenticated ? (
                t('widget.confirmBooking')
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  {t('widget.loginToBook')}
                </>
              )
            ) : (
              t('widget.seminarEnded')
            )}
          </Button>
        </motion.div>

        {!isAuthenticated && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t('widget.loginHint')}
          </p>
        )}
      </CardContent>

      <BookSeatDialog seminar={seminar} open={open} onOpenChange={setOpen} />
    </Card>
  );
}