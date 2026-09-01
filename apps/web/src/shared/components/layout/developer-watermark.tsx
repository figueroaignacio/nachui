'use client';

import { Avatar } from '@repo/ui/components/avatar';
import { useTranslations } from 'next-intl';

const GITHUB_USERNAME = 'figueroaignacio';

export function DeveloperWatermark() {
  const t = useTranslations('components.footer');

  return (
    <div className="flex items-center gap-3">
      <Avatar className="ring-border ring-2">
        <Avatar.Image
          src={`https://github.com/${GITHUB_USERNAME}.png`}
          alt={`${GITHUB_USERNAME} avatar`}
        />
        <Avatar.Fallback>IF</Avatar.Fallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-foreground text-sm font-semibold">{GITHUB_USERNAME}</span>
        <span className="text-muted-foreground text-xs">{t('headline')}</span>
      </div>
    </div>
  );
}
