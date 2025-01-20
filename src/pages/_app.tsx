import ThemeProvider from '@/core/context/theme';
import SnackbarProvider from '@/core/context/snackbar';
import QueryProvider from '@/core/context/query';
import SessionProvider from '@/core/auth/context/session';
import { DEFAULT_CONFIGURATION } from '@/constants/theme';

import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => (
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


export default App;
