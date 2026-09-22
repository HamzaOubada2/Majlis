'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame } from 'lucide-react';
import { useSeminars } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import { SeminarCard } from '@/components/seminars/seminar-card';
import { CardsGridSkeleton } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { CalendarX2 } from 'lucide-react';

export function FeaturedSeminars() {
  const { data: seminars, isLoading } = useSeminars();
  const { t } = useI18n();

  const featured = seminars
    ?.filter((s) => new Date(s.eventDate).getTime() > Date.now() - 86_400_000)
    .slice(0, 6);

  return (
    <section className="container py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-black text-gold">
            <Flame className="h-3.5 w-3.5" />
            {t('featured.label')}
          </div>
          <h2 className="text-2xl font-black sm:text-3xl">{t('featured.title')}</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {t('featured.subtitle')}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/seminars">
            {t('featured.viewAll')}
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
      </motion.div>

      <div className="mt-8">
        {isLoading ? (
          <CardsGridSkeleton count={3} />
        ) : featured && featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((seminar) => (
              <SeminarCard key={seminar.id} seminar={seminar} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarX2}
            title={t('empty.noSeminars')}
            description={t('empty.noSeminarsDesc')}
          />
        )}
      </div>
    </section>
  );
}