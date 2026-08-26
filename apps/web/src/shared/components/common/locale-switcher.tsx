'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { Tick02Icon, TranslateIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { DropdownMenu } from '@repo/ui/components/dropdown-menu';
import type { Locale } from 'next-intl';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
};

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('components.localeSwitcher');
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(newLocale: Locale) {
    startTransition(() => {
      router.replace({ pathname }, { locale: newLocale });
    });
  }

  const localeName = (code: string) => LOCALE_NAMES[code] ?? code.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          title={t('label')}
          aria-label={`${t('label')}: ${localeName(locale)}`}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex items-center justify-center rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <HugeiconsIcon icon={TranslateIcon} size={16} aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="min-w-44">
        <DropdownMenu.Label className="tracking-normal normal-case">
          {t('heading')}
        </DropdownMenu.Label>
        {locales.map((localeOption) => {
          const isCurrent = locale === localeOption;

          return (
            <DropdownMenu.Item
              key={localeOption}
              onClick={() => handleLocaleChange(localeOption as Locale)}
              disabled={isPending}
              className="justify-between gap-6"
            >
              <span className={isCurrent ? 'text-foreground font-medium' : ''}>
                {localeName(localeOption)}
              </span>
              {isCurrent && <HugeiconsIcon icon={Tick02Icon} size={15} aria-hidden="true" />}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
