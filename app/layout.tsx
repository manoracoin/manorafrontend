import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from 'next/headers';
import { I18nProvider } from "@/components/i18n-provider";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Manora',
  description: 'Manora',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as 'en' | 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const messages = locale === 'ar' ? ar : en;
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <I18nProvider locale={locale} dir={dir} messages={messages}>
            {children}
          </I18nProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}