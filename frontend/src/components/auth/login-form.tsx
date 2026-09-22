'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Lock, Mail, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthShell } from '@/components/auth/auth-shell';
import { FormField } from '@/components/auth/form-field';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-provider';
import { useI18n } from '@/lib/i18n-provider';

export function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace(next);
  }, [isAuthenticated, router, next]);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = t('form.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('form.emailInvalid');
    if (!password) e.password = t('form.passwordRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      router.replace(next);
    } catch {
      // toast handled in provider
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField
          id="email"
          label={t('form.email')}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(v) => setEmail(v)}
          error={errors.email}
          autoComplete="email"
          dir="ltr"
          icon={<Mail className="h-4 w-4" />}
        />
        <FormField
          id="password"
          label={t('form.password')}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(v) => setPassword(v)}
          error={errors.password}
          autoComplete="current-password"
          icon={<Lock className="h-4 w-4" />}
        />

        <div className="flex items-center justify-between text-xs">
          <Link href="/register" className="font-bold text-primary hover:underline">
            {t('auth.noAccount')}
          </Link>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 text-gold" />
            {t('auth.secure')}
          </span>
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            {t('auth.loginButton')}
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </motion.div>
      </form>
    </AuthShell>
  );
}