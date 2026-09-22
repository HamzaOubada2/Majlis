'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthShell } from '@/components/auth/auth-shell';
import { FormField } from '@/components/auth/form-field';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-provider';
import { useI18n } from '@/lib/i18n-provider';
import { cn } from '@/lib/utils';

interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

export function RegisterForm() {
  const { register, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/profile');
  }, [isAuthenticated, router]);

  const validate = () => {
    const e: RegisterErrors = {};
    if (fullName.trim().length < 3) e.fullName = t('form.fullNameInvalid');
    if (!email.trim()) e.email = t('form.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('form.emailInvalid');
    if (!password) e.password = t('form.passwordRequired');
    else if (password.length < 6) e.password = t('form.passwordMin');
    if (confirm !== password) e.confirm = t('form.confirmMismatch');
    if (!terms) e.terms = t('form.termsRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({ fullName: fullName.trim(), email: email.trim(), password });
      router.replace('/profile');
    } catch {
      // toast handled in provider
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={t('register.title')}
      subtitle={t('register.subtitle')}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField
          id="fullName"
          label={t('form.fullName')}
          placeholder={t('register.namePlaceholder')}
          value={fullName}
          onChange={(v) => setFullName(v)}
          error={errors.fullName}
          autoComplete="name"
          icon={<User className="h-4 w-4" />}
        />
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
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="password"
            label={t('form.password')}
            type="password"
            placeholder={t('register.passwordPlaceholder')}
            value={password}
            onChange={(v) => setPassword(v)}
            error={errors.password}
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" />}
          />
          <FormField
            id="confirm"
            label={t('form.confirm')}
            type="password"
            placeholder={t('register.confirmPlaceholder')}
            value={confirm}
            onChange={(v) => setConfirm(v)}
            error={errors.confirm}
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" />}
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-start gap-2.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="h-4 w-4 accent-emerald-800"
              />
            </span>
            <span className="text-sm text-muted-foreground">
              {t('register.termsPrefix')}{' '}
              <span className="font-bold text-primary">{t('register.terms')}</span>{' '}
              {t('register.andPrivacy')}
            </span>
          </label>
          {errors.terms && (
            <p className="flex items-center gap-1 text-xs font-semibold text-destructive">
              {errors.terms}
            </p>
          )}
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button type="submit" size="lg" variant="gold" className="w-full" loading={submitting}>
            {t('register.create')}
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </motion.div>

        <p className="text-center text-xs font-medium text-muted-foreground">
          {t('register.haveAccount')}{' '}
          <Link href="/login" className={cn('font-bold text-primary hover:underline')}>
            {t('register.login')}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}