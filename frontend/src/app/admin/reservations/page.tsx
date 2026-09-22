import type { Metadata } from 'next';
import { ReservationsPage } from '@/components/admin/reservations-page';

export const metadata: Metadata = {
  title: 'الحجوزات والحاضرون',
  description: 'تابع حجوزات وحضور الندوات لحظة بلحظة.',
};

export default function AdminReservationsPage() {
  return <ReservationsPage />;
}