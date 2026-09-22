'use client';

import { useMemo, useState } from 'react';
import { CalendarX2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useDeleteSeminar, useSeminars } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import type { Seminar } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { isUpcoming } from '@/lib/format';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 8;

interface SeminarsTableProps {
  onAdd: () => void;
  onEdit: (seminar: Seminar) => void;
}

type SeminarStatus = 'upcoming' | 'ended' | 'full';

function getStatus(seminar: Seminar): SeminarStatus {
  if (!isUpcoming(seminar.eventDate)) return 'ended';
  if (Number(seminar.availableSeats) <= 0) return 'full';
  return 'upcoming';
}

function StatusBadge({ status }: { status: SeminarStatus }) {
  const { t } = useI18n();
  if (status === 'ended') {
    return (
      <Badge variant="outline">
        <CalendarX2 className="h-3 w-3" />
        {t('admin.statusEnded')}
      </Badge>
    );
  }
  if (status === 'full') {
    return <Badge variant="destructive">{t('admin.statusFull')}</Badge>;
  }
  return <Badge variant="success">{t('admin.statusUpcoming')}</Badge>;
}

export function SeminarsTable({ onAdd, onEdit }: SeminarsTableProps) {
  const { data: seminars, isLoading, isError } = useSeminars();
  const { t, toDigits, formatDate, formatTime } = useI18n();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const deleteSeminar = useDeleteSeminar();

  const filtered = useMemo(() => {
    if (!seminars) return [];
    const q = search.trim().toLowerCase();
    if (!q) return seminars;
    return seminars.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.scholar?.name.toLowerCase().includes(q) ?? false),
    );
  }, [seminars, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-4">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t('admin.searchSeminars')}
            className="ps-10"
            dir="auto"
          />
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" />
          {t('admin.addSeminarBtn')}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : isError || !seminars || seminars.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={CalendarX2}
            title={t('admin.emptySeminars')}
            description={t('admin.emptySeminarsDesc')}
            action={
              <Button onClick={onAdd}>
                <Plus className="h-4 w-4" />
                {t('admin.addSeminarBtn')}
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">{t('admin.seminarTitle')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('admin.scholar')}</TableHead>
                  <TableHead>{t('admin.eventDate')}</TableHead>
                  <TableHead className="text-center">{t('admin.capacity')}</TableHead>
                  <TableHead className="text-center">{t('admin.availableSeats')}</TableHead>
                  <TableHead>{t('admin.status')}</TableHead>
                  <TableHead className="text-end">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((seminar) => {
                  const status = getStatus(seminar);
                  return (
                    <TableRow key={seminar.id}>
                      <TableCell>
                        <div className="min-w-0 font-bold leading-snug">{seminar.title}</div>
                        <div className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                          {formatDate(seminar.eventDate)} · {formatTime(seminar.eventDate)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm font-semibold text-primary">
                          {seminar.scholar?.name ?? (
                            <span className="text-muted-foreground">{t('card.unknownLecturer')}</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap sm:table-cell text-xs font-semibold text-muted-foreground">
                        {formatDate(seminar.eventDate)}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {toDigits(Number(seminar.capacity) || 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            'inline-flex h-7 min-w-8 items-center justify-center rounded-full px-2 text-xs font-black',
                            Number(seminar.availableSeats) <= 0
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-success/10 text-success',
                          )}
                        >
                          {toDigits(seminar.availableSeats)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEdit(seminar)}>
                            <Pencil className="h-3.5 w-3.5" />
                            {t('admin.edit')}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                {t('admin.delete')}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('admin.deleteSeminarTitle')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('admin.deleteSeminarDesc', { name: seminar.title })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={deleteSeminar.isPending}
                                  onClick={() => deleteSeminar.mutate(seminar.id)}
                                >
                                  {deleteSeminar.isPending ? t('admin.saving') : t('admin.confirmDelete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filtered.length > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 p-4">
              <p className="text-xs font-semibold text-muted-foreground">
                {t('admin.pageInfo', { page: toDigits(safePage), total: toDigits(totalPages) })}
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

          {filtered.length === 0 && search.trim() !== '' && (
            <div className="p-6">
              <EmptyState
                icon={Search}
                title={t('empty.noResults')}
                description={t('empty.noResultsDesc')}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}