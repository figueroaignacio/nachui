'use client';

import { Search02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

export type SkillsSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SkillsSearchInput({ value, onChange }: SkillsSearchInputProps) {
  const t = useTranslations('components.skillsList');

  return (
    <div className="relative mb-8">
      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center">
        <HugeiconsIcon icon={Search02Icon} size={15} />
      </span>
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchLabel')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-foreground placeholder:text-muted-foreground/50 border-border focus:border-foreground/40 w-full border-b border-dashed bg-transparent py-3 pl-6 font-mono text-base transition-colors outline-none"
      />
      <kbd className="text-muted-foreground border-border absolute inset-y-0 right-0 hidden items-center rounded-sm border px-1.5 py-0.5 font-mono text-xs sm:flex">
        /
      </kbd>
    </div>
  );
}
