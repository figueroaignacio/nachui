'use client';

import { Button } from '@repo/ui/components/button';
import { useTranslations } from 'next-intl';
import { useChatStore } from '../store/chat-store';

export function AskAiButton() {
  const t = useTranslations('components.chat');
  const openChat = useChatStore((state) => state.openChat);

  return (
    <Button variant="outline" size="sm" onClick={openChat}>
      {t('ask')}
    </Button>
  );
}
