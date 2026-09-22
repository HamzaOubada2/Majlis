import type { Metadata } from 'next';
import { ProfileDashboard } from '@/components/profile/profile-dashboard';
import { AuthGuard } from '@/components/shared/auth-guard';

export const metadata: Metadata = {
  title: 'حسابي',
  description: 'استعرض بياناتك وحجوزاتك في منصة مجلس.',
};

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileDashboard />
    </AuthGuard>
  );
}