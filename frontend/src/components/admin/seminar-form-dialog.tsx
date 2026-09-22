'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { useCreateSeminar, useScholars, useUpdateSeminar } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-provider';
import type { Seminar, SeminarPayload } from '@/lib/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SeminarFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seminar?: Seminar | null;
}

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function SeminarFormDialog({ open, onOpenChange, seminar }: SeminarFormDialogProps) {
  const { t } = useI18n();
  const isEdit = Boolean(seminar);
  const { data: scholars = [], isLoading: scholarsLoading } = useScholars();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [scholarId, setScholarId] = useState<string>('none');
  const [capacity, setCapacity] = useState<string>('');
  const [eventDate, setEventDate] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(seminar?.title ?? '');
      setDescription(seminar?.description ?? '');
      setLocation(seminar?.location ?? '');
      setScholarId(seminar?.scholarId ?? 'none');
      setCapacity(seminar ? String(seminar.capacity) : '');
      setEventDate(seminar ? toLocalInputValue(seminar.eventDate) : '');
    }
  }, [open, seminar]);

  const createSeminar = useCreateSeminar();
  const updateSeminar = useUpdateSeminar();
  const isPending = isEdit ? updateSeminar.isPending : createSeminar.isPending;

  const canSubmit = title.trim() !== '' && location.trim() !== '' && Number(capacity) >= 1 && eventDate !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload: SeminarPayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      location: location.trim(),
      capacity: Number(capacity),
      scholarId: scholarId === 'none' ? null : scholarId,
      eventDate: new Date(eventDate).toISOString(),
    };

    const onSuccess = () => onOpenChange(false);

    if (isEdit && seminar) {
      updateSeminar.mutate({ id: seminar.id, payload }, { onSuccess });
    } else {
      createSeminar.mutate(payload, { onSuccess });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-5 w-5 text-primary" />
            {isEdit ? t('admin.editSeminarTitle') : t('admin.addSeminarTitle')}
          </DialogTitle>
          <DialogDescription>{t('admin.seminarsSubtitle')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seminar-title">{t('admin.seminarTitle')}</Label>
            <Input
              id="seminar-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('admin.seminarTitlePlaceholder')}
              required
              dir="auto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seminar-desc">{t('admin.description')}</Label>
            <Textarea
              id="seminar-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              dir="auto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seminar-location">{t('admin.location')}</Label>
            <Input
              id="seminar-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('admin.location')}
              required
              dir="auto"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('admin.scholar')}</Label>
            <Select value={scholarId} onValueChange={setScholarId}>
              <SelectTrigger disabled={scholarsLoading}>
                <SelectValue placeholder={t('admin.selectScholar')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('admin.noScholar')}</SelectItem>
                {scholars.map((scholar) => (
                  <SelectItem key={scholar.id} value={scholar.id}>
                    {scholar.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="seminar-capacity">{t('admin.capacity')}</Label>
              <Input
                id="seminar-capacity"
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seminar-date">{t('admin.eventDate')}</Label>
              <Input
                id="seminar-date"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" loading={isPending} disabled={!canSubmit}>
              {isPending ? t('admin.saving') : t('admin.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}