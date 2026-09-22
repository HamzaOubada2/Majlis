import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import { FullPageLoader } from '@/components/shared/loading';

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
  description: 'سجّل الدخول إلى حسابك في منصة مجلس.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <LoginForm />
    </Suspense>
  );
}