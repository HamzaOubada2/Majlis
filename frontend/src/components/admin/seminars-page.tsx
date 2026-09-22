'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';
import type { Seminar } from '@/lib/types';
import { SeminarsTable } from '@/components/admin/seminars-table';
import { SeminarFormDialog } from '@/components/admin/seminar-form-dialog';

export function SeminarsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Seminar | null>(null);

  const autoOpen = searchParams.get('new') === '1';

  useEffect(() => {
    if (autoOpen) {
      setEditing(null);
      setDialogOpen(true);
      router.replace('/admin/seminars');
    }
  }, [autoOpen, router]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (seminar: Seminar) => {
    setEditing(seminar);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-black">
          <CalendarDays className="h-5 w-5 text-primary" />
          {t('admin.seminarsTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('admin.seminarsSubtitle')}</p>
      </div>

      <SeminarsTable onAdd={openAdd} onEdit={openEdit} />

      <SeminarFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        seminar={editing}
      />
    </div>
  );
}