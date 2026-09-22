'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';
import { FullPageLoader } from '@/components/shared/loading';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: string;
}

export function AuthGuard({ children, fallback = '/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(fallback);
    }
  }, [isLoading, isAuthenticated, router, fallback]);

  if (isLoading || !isAuthenticated) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}