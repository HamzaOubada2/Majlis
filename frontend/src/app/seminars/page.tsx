import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SeminarsDirectory } from '@/components/seminars/seminars-directory';
import { FullPageLoader } from '@/components/shared/loading';

export const metadata: Metadata = {
  title: 'الندوات',
  description: 'تصفح دليل الندوات والمجالس العلمية، ورشّح حسب التخصص والتوفر والموعد.',
};

export default function SeminarsPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <SeminarsDirectory />
    </Suspense>
  );
}