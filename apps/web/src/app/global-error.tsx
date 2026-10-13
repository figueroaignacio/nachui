'use client';

import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/constants';
import en from '@/locales/en/pages.json';
import es from '@/locales/es/pages.json';
import { Button } from '@repo/ui/components/button';
import { Typography } from '@repo/ui/components/typography';
import { Flex } from '@repo/ui/layout/flex';
import { usePathname } from 'next/navigation';

/**
 * global-error replaces the root layout, so the next-intl provider is gone.
 * The copy comes straight from the pages messages, picked by the URL's
 * locale segment.
 */
const COPY: Record<Locale, typeof en.globalError> = {
  en: en.globalError,
  es: es.globalError,
};

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const segment = usePathname()?.split('/')[1] ?? '';
  const locale = isLocale(segment) ? segment : DEFAULT_LOCALE;
  const copy = COPY[locale];

  return (
    <html lang={locale}>
      <body>
        <Flex
          direction="column"
          align="center"
          justify="center"
          className="min-h-screen p-4 text-center"
        >
          <Typography variant="h2" className="mb-2 text-3xl font-bold">
            {copy.title}
          </Typography>
          <Typography variant="p" className="text-muted-foreground mb-6">
            {copy.description}
          </Typography>
          <Button onClick={() => reset()}>{copy.retry}</Button>
        </Flex>
      </body>
    </html>
  );
}
