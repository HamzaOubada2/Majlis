'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth-provider';
import { I18nProvider, useI18n } from '@/lib/i18n-provider';
import { ThemeProvider } from '@/lib/theme-provider';

function ToastHost() {
  const { dir } = useI18n();
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      dir={dir}
      toastOptions={{
        style: {
          direction: dir,
          fontFamily: 'Cairo, sans-serif',
        },
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            {children}
            <ToastHost />
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}