import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppThemeProvider } from '@/theme/ThemeProvider';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { getGlobal } from '@/lib/strapi';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobal();
  return {
    title: {
      default: global?.seoTitle ?? global?.siteName ?? '个人网站',
      template: `%s — ${global?.siteName ?? '个人网站'}`,
    },
    description: global?.seoDescription ?? global?.tagline ?? '',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const global = await getGlobal();

  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <body>
        <AppThemeProvider>
          <Navbar siteName={global?.siteName ?? '个人站点'} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer
            siteName={global?.siteName ?? '个人站点'}
            footerText={global?.footerText ?? global?.tagline ?? undefined}
          />
        </AppThemeProvider>
      </body>
    </html>
  );
}
