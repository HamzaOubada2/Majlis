'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, GraduationCap, LayoutDashboard, ListOrdered } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { useI18n } from '@/lib/i18n-provider';
import { getUserInitials } from '@/lib/format';
import type { TranslationKey } from '@/lib/translations';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdminNavItem {
  href: string;
  label: TranslationKey;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

const ADMIN_NAV: AdminNavItem[] = [
  { href: '/admin', label: 'admin.overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/scholars', label: 'admin.scholars', icon: GraduationCap },
  { href: '/admin/seminars', label: 'admin.seminars', icon: CalendarDays },
  { href: '/admin/reservations', label: 'admin.reservations', icon: ListOrdered },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">{t('admin.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('admin.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="soft">
            {t('profile.roleAdmin')}
          </Badge>
          <Avatar className="h-10 w-10 border border-border">
            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <nav
        className="mb-8 flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-sm"
        aria-label={t('nav.mainAria')}
      >
        {ADMIN_NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {t(label)}
              {isActive && (
                <motion.span
                  layoutId="admin-nav-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-primary/10 ring-1 ring-primary/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
        <span className="ms-auto hidden items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground md:flex">
          <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('admin.backToSite')}
          </Link>
        </span>
      </nav>

      <main>{children}</main>
    </div>
  );
}