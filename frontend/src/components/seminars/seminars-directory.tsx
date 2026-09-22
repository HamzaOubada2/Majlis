'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarRange, FilterX, Search, SlidersHorizontal } from 'lucide-react';
import { useSeminars } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import { SeminarCard } from '@/components/seminars/seminar-card';
import { CardsGridSkeleton } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isUpcoming } from '@/lib/format';

interface FiltersValue {
  search: string;
  availability: 'all' | 'available' | 'full';
  time: 'all' | 'upcoming' | 'past';
  sort: 'soonest' | 'latest' | 'seats';
}

const DEFAULT_FILTERS: FiltersValue = {
  search: '',
  availability: 'all',
  time: 'all',
  sort: 'soonest',
};

export function SeminarsDirectory() {
  const { data: seminars, isLoading } = useSeminars();
  const searchParams = useSearchParams();
  const { t, toDigits } = useI18n();
  const [filters, setFilters] = useState<FiltersValue>(() => ({
    ...DEFAULT_FILTERS,
    search: searchParams.get('q') ?? '',
  }));

  const filtered = useMemo(() => {
    if (!seminars) return [];
    const q = filters.search.trim().toLowerCase();

    const list = seminars.filter((s) => {
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        (s.scholar?.name.toLowerCase().includes(q) ?? false);

      const available = Number(s.availableSeats) > 0;
      const matchesAvailability =
        filters.availability === 'all' ||
        (filters.availability === 'available' && available) ||
        (filters.availability === 'full' && !available);

      const upcoming = isUpcoming(s.eventDate);
      const matchesTime =
        filters.time === 'all' ||
        (filters.time === 'upcoming' && upcoming) ||
        (filters.time === 'past' && !upcoming);

      return matchesSearch && matchesAvailability && matchesTime;
    });

    const sorted = [...list];
    switch (filters.sort) {
      case 'soonest':
        sorted.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
        break;
      case 'latest':
        sorted.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
        break;
      case 'seats':
        sorted.sort((a, b) => Number(a.availableSeats) - Number(b.availableSeats));
        break;
    }
    return sorted;
  }, [seminars, filters]);

  const apply = (patch: Partial<FiltersValue>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <section className="container py-12">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
          <CalendarRange className="h-3.5 w-3.5" />
          {t('dir.badge')}
        </div>
        <h1 className="text-3xl font-black sm:text-4xl">{t('dir.title')}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t('dir.subtitle')}
        </p>
      </div>

      {/* Filters bar */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => apply({ search: e.target.value })}
              placeholder={t('dir.searchPlaceholder')}
              className="ps-10"
              dir="auto"
            />
          </div>

          <Select
            value={filters.availability}
            onValueChange={(v) => apply({ availability: v as FiltersValue['availability'] })}
          >
            <SelectTrigger className="md:w-40">
              <SelectValue placeholder={t('dir.availability')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('dir.availAll')}</SelectItem>
              <SelectItem value="available">{t('dir.availAvailable')}</SelectItem>
              <SelectItem value="full">{t('dir.availFull')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.time}
            onValueChange={(v) => apply({ time: v as FiltersValue['time'] })}
          >
            <SelectTrigger className="md:w-36">
              <SelectValue placeholder={t('dir.time')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('dir.timeAll')}</SelectItem>
              <SelectItem value="upcoming">{t('dir.timeUpcoming')}</SelectItem>
              <SelectItem value="past">{t('dir.timePast')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sort}
            onValueChange={(v) => apply({ sort: v as FiltersValue['sort'] })}
          >
            <SelectTrigger className="md:w-36">
              <SelectValue placeholder={t('dir.sort')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soonest">{t('dir.sortSoonest')}</SelectItem>
              <SelectItem value="latest">{t('dir.sortLatest')}</SelectItem>
              <SelectItem value="seats">{t('dir.sortSeats')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="mb-5 mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4 text-gold" />
        <span>
          {isLoading ? t('common.loading') : t('dir.results', { n: toDigits(filtered.length) })}
        </span>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <FilterX className="h-3 w-3" />
            {t('dir.clearFilters')}
          </button>
        )}
      </div>

      {isLoading ? (
        <CardsGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('empty.noResults')}
          description={t('empty.noResultsDesc')}
          action={
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-emerald-800"
            >
              {t('dir.resetFilters')}
            </button>
          }
        />
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((seminar) => (
              <SeminarCard key={seminar.id} seminar={seminar} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}