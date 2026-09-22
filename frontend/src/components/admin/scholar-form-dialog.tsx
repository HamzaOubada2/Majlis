'use client';

import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useCreateScholar, useUpdateScholar } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import type { Scholar, ScholarPayload } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ScholarFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholar?: Scholar | null;
}

export function ScholarFormDialog({ open, onOpenChange, scholar }: ScholarFormDialogProps) {
  const { t } = useI18n();
  const isEdit = Boolean(scholar);

  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (open) {
      setName(scholar?.name ?? '');
      setSpecialization(scholar?.specialization ?? '');
      setBio(scholar?.bio ?? '');
      setAvatarUrl(scholar?.avatarUrl ?? '');
    }
  }, [open, scholar]);

  const createScholar = useCreateScholar();
  const updateScholar = useUpdateScholar();
  const isPending = isEdit ? updateScholar.isPending : createScholar.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: ScholarPayload = {
      name: name.trim(),
      specialization: specialization.trim() || undefined,
      bio: bio.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
    };

    const onSuccess = () => onOpenChange(false);

    if (isEdit && scholar) {
      updateScholar.mutate({ id: scholar.id, payload }, { onSuccess });
    } else {
      createScholar.mutate(payload, { onSuccess });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-5 w-5 text-primary" />
            {isEdit ? t('admin.editScholarTitle') : t('admin.addScholarTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t('admin.scholarsSubtitle') : t('admin.scholarsSubtitle')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scholar-name">{t('admin.scholarName')}</Label>
            <Input
              id="scholar-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('admin.scholarName')}
              required
              dir="auto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scholar-specialization">{t('admin.specialization')}</Label>
            <Input
              id="scholar-specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder={t('admin.specialization')}
              dir="auto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scholar-bio">{t('admin.bio')}</Label>
            <Textarea
              id="scholar-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              dir="auto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scholar-avatar">{t('admin.avatarUrl')}</Label>
            <Input
              id="scholar-avatar"
              type="url"
              dir="ltr"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" loading={isPending} disabled={!name.trim()}>
              {isPending ? t('admin.saving') : t('admin.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}