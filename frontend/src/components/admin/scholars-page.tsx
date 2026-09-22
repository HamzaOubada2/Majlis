'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';
import type { Scholar } from '@/lib/types';
import { ScholarsTable } from '@/components/admin/scholars-table';
import { ScholarFormDialog } from '@/components/admin/scholar-form-dialog';

export function ScholarsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Scholar | null>(null);

  const autoOpen = searchParams.get('new') === '1';

  useEffect(() => {
    if (autoOpen) {
      setEditing(null);
      setDialogOpen(true);
      router.replace('/admin/scholars');
    }
  }, [autoOpen, router]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (scholar: Scholar) => {
    setEditing(scholar);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-black">
          <GraduationCap className="h-5 w-5 text-primary" />
          {t('admin.scholarsTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('admin.scholarsSubtitle')}</p>
      </div>

      <ScholarsTable onAdd={openAdd} onEdit={openEdit} />

      <ScholarFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        scholar={editing}
      />
    </div>
  );
}