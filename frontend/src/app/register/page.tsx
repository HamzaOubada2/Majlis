import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'إنشاء حساب',
  description: 'أنشئ حسابك في منصة مجلس وابدأ بحجز مقاعدك في الندوات العلمية.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}