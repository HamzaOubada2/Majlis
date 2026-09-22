'use client';

import Link from 'next/link';
import { CalendarDays, GraduationCap, Landmark, MapPin } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { useI18n } from '@/lib/i18n-provider';

const quickLinkKeys = [
  { href: '/', label: 'nav.main' },
  { href: '/seminars', label: 'nav.seminars' },
  { href: '/scholars', label: 'nav.scholars' },
  { href: '/profile', label: 'account.myReservations' },
  { href: '/register', label: 'account.register' },
] as const;

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border/60 bg-emeralddeep text-primary-foreground">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-2">
          <div className="[&_*]:!text-primary-foreground">
            <Logo />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-emerald-100/85">
            {t('footer.description')}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-emerald-100/75">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold" /> {t('footer.location')}
            </span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-black">
            <Landmark className="h-4 w-4 text-gold" />
            {t('footer.quickLinks')}
          </h3>
          <ul className="space-y-2.5 text-sm font-semibold text-emerald-100/85">
            {quickLinkKeys.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-gold">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-black">
            <GraduationCap className="h-4 w-4 text-gold" />
            {t('footer.about')}
          </h3>
          <p className="text-sm leading-relaxed text-emerald-100/85">{t('footer.aboutText')}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold">
            <CalendarDays className="h-4 w-4 text-gold" />
            {t('footer.newsletter')}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-emerald-100/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}