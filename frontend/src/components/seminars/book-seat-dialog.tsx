'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Armchair, Calendar, LogIn, MapPin, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { useBookSeat } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import type { Seminar } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BookSeatDialogProps {
  seminar: Seminar;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookSeatDialog({ seminar, open, onOpenChange }: BookSeatDialogProps) {
  const { isAuthenticated } = useAuth();
  const { t, toDigits, formatDateTime } = useI18n();
  const router = useRouter();
  const book = useBookSeat();

  const soldOut = Number(seminar.availableSeats) <= 0;
  const remaining = Math.max(0, Number(seminar.availableSeats) || 0);

  const handleConfirm = () => {
    if (!isAuthenticated) {
      onOpenChange(false);
      router.push(`/login?next=/seminars/${seminar.id}`);
      return;
    }
    if (soldOut) return;
    book.mutate(seminar.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Armchair className="h-5 w-5 text-primary" />
            {t('dialog.bookTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('dialog.bookDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border bg-secondary/40 p-4">
            <h3 className="text-base font-bold leading-snug">{seminar.title}</h3>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              {seminar.scholar && (
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{seminar.scholar.name}</span>
                </p>
              )}
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {formatDateTime(seminar.eventDate)}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {seminar.location}
              </p>
            </div>
          </div>

          {soldOut ? (
            <div className="rounded-xl bg-destructive/10 p-4 text-center text-sm font-bold text-destructive">
              {t('dialog.soldOutMsg')}
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-success/10 px-4 py-3">
              <span className="text-sm font-bold text-success">
                {t('dialog.availableNow')}
              </span>
              <Badge variant="success" className="text-sm">
                {t('dialog.seatsCount', { n: toDigits(remaining) })}
              </Badge>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-100/70 px-4 py-3 text-sm font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
              <LogIn className="h-4 w-4 shrink-0" />
              {t('dialog.loginRequiredMsg')}
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('dialog.cancel')}
          </Button>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              variant="gold"
              size="lg"
              loading={book.isPending}
              disabled={soldOut}
              onClick={handleConfirm}
            >
              {isAuthenticated ? t('dialog.confirm') : t('dialog.loginToBook')}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}