'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { translations, type TranslationKey } from './translations';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
};

interface I18nContextValue {
  dir: 'rtl';
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  toDigits: (value: number | string) => string;
  formatDate: (iso: string | Date) => string;
  formatTime: (iso: string | Date) => string;
  formatDateTime: (iso: string | Date) => string;
  remainingLabel: (iso: string | Date) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const INTL_LOCALE = 'ar-SA';
const NUMBERING_SYSTEM = 'latn';

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      let text: string = translations[key];
      if (params) {
        for (const [name, value] of Object.entries(params)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [],
  );

  const dir: 'rtl' = 'rtl';

  const toDigits = useCallback((value: number | string) => String(value), []);

  const formatDate = useCallback(
    (iso: string | Date) => {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '—';
      return new Intl.DateTimeFormat(INTL_LOCALE, {
        ...DATE_OPTIONS,
        numberingSystem: NUMBERING_SYSTEM,
      }).format(date);
    },
    [],
  );

  const formatTime = useCallback(
    (iso: string | Date) => {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '—';
      return new Intl.DateTimeFormat(INTL_LOCALE, {
        ...TIME_OPTIONS,
        numberingSystem: NUMBERING_SYSTEM,
      }).format(date);
    },
    [],
  );

  const formatDateTime = useCallback(
    (iso: string | Date) => `${formatDate(iso)} · ${formatTime(iso)}`,
    [formatDate, formatTime],
  );

  const remainingLabel = useCallback(
    (iso: string | Date) => {
      const diff = new Date(iso).getTime() - Date.now();
      if (diff <= 0) return t('remaining.ended');
      const days = Math.floor(diff / 86_400_000);
      if (days === 0) return t('remaining.today');
      if (days === 1) return t('remaining.tomorrow');
      return t('remaining.days', { n: toDigits(days) });
    },
    [t, toDigits],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      dir,
      t,
      toDigits,
      formatDate,
      formatTime,
      formatDateTime,
      remainingLabel,
    }),
    [dir, t, toDigits, formatDate, formatTime, formatDateTime, remainingLabel],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}