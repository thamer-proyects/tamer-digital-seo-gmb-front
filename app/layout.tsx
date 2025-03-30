import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import LoadingContextProvider from '@/store/loadingContext';
import { Sidebar } from '@/components/navigation/sidebar';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SEO Analytics Dashboard',
  description: 'Modern SEO optimization and analysis tool',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <LoadingContextProvider>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-0 light dark:dark">{children}</main>
              </div>
            </LoadingContextProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
