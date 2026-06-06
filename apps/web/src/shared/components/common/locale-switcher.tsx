'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { LanguageSquareIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { DropdownMenu } from '@repo/ui/components/dropdown-menu';
import type { Locale } from 'next-intl';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

const LOCALE_LABELS: Record<string, string> = {
  es: 'ES',
  en: 'EN',
};

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(newLocale: Locale) {
    startTransition(() => {
      router.replace({ pathname }, { locale: newLocale });
    });
  }

  const getLocaleLabel = (code: string) => {
    return LOCALE_LABELS[code] || code.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={LanguageSquareIcon} size={16} />
          <span className="text-xs">{getLocaleLabel(locale)}</span>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="min-w-[140px]">
        {locales.map((localeOption) => (
          <DropdownMenu.Item
            key={localeOption}
            onClick={() => handleLocaleChange(localeOption as Locale)}
            disabled={isPending}
            className="justify-between"
          >
            <span className={locale === localeOption ? 'font-medium' : ''}>
              {getLocaleLabel(localeOption)}
            </span>
            {locale === localeOption && <HugeiconsIcon icon={Tick02Icon} size={16} />}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
