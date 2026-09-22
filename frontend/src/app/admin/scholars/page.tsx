import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ScholarsPage } from '@/components/admin/scholars-page';

export const metadata: Metadata = {
  title: 'إدارة المحاضرين',
  description: 'أضف وعدّل واحذف المحاضرين على المنصة.',
};

export default function AdminScholarsPage() {
  return (
    <Suspense>
      <ScholarsPage />
    </Suspense>
  );
}