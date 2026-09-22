'use client';

import { useMemo, useState } from 'react';
import { GraduationCap, Pencil, Plus, Search, Trash2, UserRoundX } from 'lucide-react';
import { useDeleteScholar, useScholars } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import type { Scholar } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getInitials } from '@/lib/format';

const PAGE_SIZE = 8;

interface ScholarsTableProps {
  onAdd: () => void;
  onEdit: (scholar: Scholar) => void;
}

export function ScholarsTable({ onAdd, onEdit }: ScholarsTableProps) {
  const { data: scholars, isLoading, isError } = useScholars();
  const { t, toDigits } = useI18n();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const deleteScholar = useDeleteScholar();

  const filtered = useMemo(() => {
    if (!scholars) return [];
    const q = search.trim().toLowerCase();
    if (!q) return scholars;
    return scholars.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.specialization ?? '').toLowerCase().includes(q),
    );
  }, [scholars, search]);

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
            placeholder={t('admin.searchScholars')}
            className="ps-10"
            dir="auto"
          />
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" />
          {t('admin.addScholarBtn')}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : isError || !scholars || scholars.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={UserRoundX}
            title={t('admin.emptyScholars')}
            description={t('admin.emptyScholarsDesc')}
            action={
              <Button onClick={onAdd}>
                <Plus className="h-4 w-4" />
                {t('admin.addScholarBtn')}
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
                  <TableHead className="w-[60%]">{t('admin.scholarName')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('admin.specialization')}</TableHead>
                  <TableHead className="text-end">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((scholar) => (
                  <TableRow key={scholar.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border">
                          {scholar.avatarUrl && (
                            <AvatarImage src={scholar.avatarUrl} alt={scholar.name} />
                          )}
                          <AvatarFallback className="text-xs">
                            {getInitials(scholar.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-bold">{scholar.name}</div>
                          {scholar.bio && (
                            <div className="max-w-[260px] truncate text-xs text-muted-foreground">
                              {scholar.bio}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {scholar.specialization ? (
                        <Badge variant="soft">
                          <GraduationCap className="h-3 w-3" />
                          {scholar.specialization}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(scholar)}>
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
                              <AlertDialogTitle>{t('admin.deleteScholarTitle')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('admin.deleteScholarDesc', { name: scholar.name })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                disabled={deleteScholar.isPending}
                                onClick={() => deleteScholar.mutate(scholar.id)}
                              >
                                {deleteScholar.isPending ? t('admin.saving') : t('admin.confirmDelete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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