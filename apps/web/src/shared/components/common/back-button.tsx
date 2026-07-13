'use client';

import { ArrowLeft } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();
  const t = useTranslations('components.backButton');

  function onBack() {
    router.back();
  }

  return (
    <button
      onClick={onBack}
      className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 font-mono text-[12px] tracking-wide uppercase transition-colors"
    >
      <HugeiconsIcon icon={ArrowLeft} size={12} />
      {t('label')}
    </button>
  );
}
