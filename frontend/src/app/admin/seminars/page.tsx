import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SeminarsPage } from '@/components/admin/seminars-page';

export const metadata: Metadata = {
  title: 'إدارة الندوات',
  description: 'أنشئ وعدّل واحذف الندوات وأدار مقاعدها.',
};

export default function AdminSeminarsPage() {
  return (
    <Suspense>
      <SeminarsPage />
    </Suspense>
  );
}