'use client';

import { ArrowLeft } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();
  const t = useTranslations('components.backButton');

  function onBack() {
    router.back();
  }

  return (
    <Button
      variant="link"
      onClick={onBack}
      leftIcon={<HugeiconsIcon icon={ArrowLeft} size={12} />}
      className="text-muted-foreground hover:text-foreground font-mono text-[12px] tracking-wide uppercase hover:no-underline"
    >
      {t('label')}
    </Button>
  );
}
