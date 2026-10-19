import '@/app/globals.css';
import { SkipLink } from '@/components/common/skip-link';
import { ThemeInitScript } from '@/components/common/theme-init-script';
import { AiChat } from '@/features/chat/containers/ai-chat';
import { Backdrop } from '@/components/layout/backdrop';
import { Footer } from '@/components/layout/footer';
import { PageFrame } from '@/components/layout/page-frame';
import { SiteHeader } from '@/features/shell/components/site-header';
import { Providers } from '@/components/providers';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/constants';
import { getAbsoluteUrl, getAssetUrl } from '@/lib/domains';
import { SPRITE_CSS } from '@repo/ui/components/sprite';
import { fontCode, fontHeading, fontSans, fontSerif } from '@/lib/font';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

const DEFAULT_OG_IMAGE = getAssetUrl('/images/og/og-home.png');

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'siteConfig' });

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NachUI',
    url: SITE_URL,
    description: t('description'),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Ignacio Figueroa',
      url: 'https://ignaciofigueroa.dev',
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <style>{SPRITE_CSS}</style>
      </head>
      <body
        className={`relative ${fontSans.variable} ${fontHeading.variable} ${fontSerif.variable} ${fontCode.variable}`}
      >
        <SkipLink />
        <Backdrop />
        <NextIntlClientProvider>
          <Providers>
            <SiteHeader />
            <PageFrame>
              <main id="main-content">{children}</main>
            </PageFrame>
            <Footer />
            {/* Mounted app-wide: the landing section and the docs pages share
                the same assistant. Only the launcher is eager; the engine and
                window load on first use. */}
            <AiChat />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'siteConfig' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'NachUI',
      template: `%s · NachUI`,
    },
    description: t('description'),
    openGraph: {
      title: 'NachUI',
      description: t('description'),
      siteName: 'NachUI',
      type: 'website',
      locale,
      url: getAbsoluteUrl(locale),
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'NachUI',
      description: t('description'),
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
