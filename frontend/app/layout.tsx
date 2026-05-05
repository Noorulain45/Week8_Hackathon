import StoreProvider from '@/src/components/StoreProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}