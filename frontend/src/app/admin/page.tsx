import type { Metadata } from 'next';
import { OverviewDashboard } from '@/components/admin/overview-dashboard';

export const metadata: Metadata = {
  title: 'لوحة التحكم',
  description: 'إحصاءات المنصة وإدارة سريعة عبر لوحة التحكم.',
};

export default function AdminPage() {
  return <OverviewDashboard />;
}