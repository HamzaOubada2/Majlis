import type { Metadata } from 'next';
import { ScholarsDirectory } from '@/components/scholars/scholars-directory';

export const metadata: Metadata = {
  title: 'المحاضرون',
  description: 'تعرّف على نخبة المحاضرين والمحاضرات في منصة مجلس العلمية.',
};

export default function ScholarsPage() {
  return <ScholarsDirectory />;
}