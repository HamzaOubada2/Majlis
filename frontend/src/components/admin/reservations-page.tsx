'use client';

import { ListOrdered } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';
import { ReservationsTable } from '@/components/admin/reservations-table';

export function ReservationsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-black">
          <ListOrdered className="h-5 w-5 text-primary" />
          {t('admin.reservationsTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('admin.reservationsSubtitle')}</p>
      </div>

      <ReservationsTable />
    </div>
  );
}