'use client';

import { useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n-provider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  autoComplete?: string;
  success?: boolean;
  dir?: 'auto' | 'rtl' | 'ltr';
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon,
  autoComplete,
  success = false,
  dir = 'rtl',
}: FormFieldProps) {
  const [show, setShow] = useState(false);
  const { t } = useI18n();
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          dir={dir}
          className={cn(
            icon && 'ps-11',
            isPassword && 'pe-11',
            error && 'border-destructive focus-visible:ring-destructive/40',
            success && 'border-success/60',
          )}
          aria-invalid={Boolean(error)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute end-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-primary"
            tabIndex={-1}
          >
            {show ? t('common.hide') : t('common.show')}
          </button>
        )}
      </div>
      {error ? (
        <p className="flex items-center gap-1 text-xs font-semibold text-destructive">
          <XCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : success ? (
        <p className="flex items-center gap-1 text-xs font-semibold text-success">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {t('common.correct')}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}