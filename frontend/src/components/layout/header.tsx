'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, GraduationCap, Home, LogOut, Menu, Moon, Sun, User2, X } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-provider';
import { useI18n } from '@/lib/i18n-provider';
import { useTheme } from '@/lib/theme-provider';
import { getUserInitials, getUserName } from '@/lib/format';
import { cn } from '@/lib/utils';

const NAV_KEYS = [
  { href: '/', label: 'nav.main', icon: Home },
  { href: '/seminars', label: 'nav.seminars', icon: CalendarDays },
  { href: '/scholars', label: 'nav.scholars', icon: GraduationCap },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label={t('nav.mainAria')}>
          {NAV_KEYS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold transition-colors',
                isActive(href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {t(label)}
              {isActive(href) && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label={theme === 'dark' ? 'Toggle light mode' : 'Toggle dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated && user ? (
            <div className="ms-1.5 relative" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-full border border-border bg-card p-1.5 pe-3 transition-shadow hover:shadow-sm"
                aria-expanded={menuOpen}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{getUserInitials(user)}</AvatarFallback>
                </Avatar>
                <span className="max-w-[100px] truncate text-sm font-bold">
                  {getUserName(user)}
                </span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute end-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
                    >
                      <User2 className="h-4 w-4 text-primary" />
                      {t('account.reservations')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('account.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">{t('account.login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{t('account.register')}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile controls + toggle */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground"
            aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t('nav.openMenu')}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border/60 bg-background/95 md:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {NAV_KEYS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold',
                    isActive(href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {t(label)}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-foreground hover:bg-secondary"
                  >
                    <User2 className="h-5 w-5 text-primary" />
                    {t('account.reservations')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5" />
                    {t('account.logout')}
                  </button>
                </>
              ) : (
                <div className="mt-1 flex gap-2">
                  <Button className="flex-1" onClick={() => { setMobileOpen(false); router.push('/register'); }}>
                    {t('account.register')}
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => { setMobileOpen(false); router.push('/login'); }}>
                    {t('account.login')}
                  </Button>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}