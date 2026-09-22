'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, RefreshCcw, TicketX, UsersRound, XCircle } from 'lucide-react';
import { useAdminReservations, useSeminars } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import { getInitials } from '@/lib/format';

const PAGE_SIZE = 10;

export function ReservationsTable() {
  const { t, toDigits, formatDate, formatTime } = useI18n();
  const { data: seminars = [] } = useSeminars();
  const [seminarId, setSeminarId] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: reservations, isLoading, isError } = useAdminReservations(
    seminarId === 'all' ? undefined : seminarId,
  );

  const filtered = reservations ?? [];
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full max-w-xs">
            <Select
              value={seminarId}
              onValueChange={(v) => {
                setSeminarId(v);
                setPage(1);
              }}
            >
              <SelectTrigger aria-label={t('admin.filterBySeminar')}>
                <SelectValue placeholder={t('admin.filterBySeminar')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.allSeminars')}</SelectItem>
                {seminars.map((seminar) => (
                  <SelectItem key={seminar.id} value={seminar.id}>
                    {seminar.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Badge variant="soft" className="gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {t('admin.live')}
        </Badge>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6">
            <EmptyState icon={RefreshCcw} title={t('admin.loadFailed')} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={TicketX}
              title={t('admin.emptyReservations')}
              description={t('admin.emptyReservationsDesc')}
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">{t('admin.attendeeName')}</TableHead>
                    <TableHead className="min-w-[200px]">{t('admin.attendeeEmail')}</TableHead>
                    <TableHead>{t('admin.seminarTitle')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('admin.bookingDate')}</TableHead>
                    <TableHead>{t('admin.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((reservation) => {
                    const user = reservation.user;
                    const fullName =
                      user?.fullname ?? user?.fullName ?? user?.email ?? '—';
                    const confirmed = reservation.status === 'CONFIRMED';
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarFallback className="text-[10px]">
                                {getInitials(fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate font-semibold">{fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground" dir="ltr">
                            {user?.email ?? '—'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="line-clamp-1 max-w-[240px] text-sm font-bold">
                            {reservation.seminar?.title ?? '—'}
                          </span>
                          {reservation.seminar?.scholar?.name && (
                            <span className="block text-xs text-muted-foreground">
                              {reservation.seminar.scholar.name}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
                          {formatDate(reservation.createdAt)} · {formatTime(reservation.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={confirmed ? 'success' : 'secondary'}>
                            {confirmed ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {confirmed ? t('admin.confirmed') : t('admin.cancelled')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filtered.length > PAGE_SIZE && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <UsersRound className="h-3.5 w-3.5" />
                  {t('admin.showing', {
                    from: toDigits((safePage - 1) * PAGE_SIZE + 1),
                    to: toDigits(Math.min(safePage * PAGE_SIZE, filtered.length)),
                    total: toDigits(filtered.length),
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {t('admin.previous')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    {t('admin.next')}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}