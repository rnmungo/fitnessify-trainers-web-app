import type { AppProps } from 'next/app';

import ThemeProvider from '@/core/context/theme';
import SnackbarProvider from '@/core/context/snackbar';
import QueryProvider from '@/core/context/query';
import SessionProvider from '@/core/auth/context/session';
import { DEFAULT_CONFIGURATION } from '@/constants/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <SessionProvider>
        <ThemeProvider theme={DEFAULT_CONFIGURATION}>
          <SnackbarProvider>
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
