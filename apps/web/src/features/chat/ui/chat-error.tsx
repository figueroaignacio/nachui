import { Callout } from '@repo/ui/components/callout';
import { useTranslations } from 'next-intl';

export function ChatError() {
  const t = useTranslations('components.chat.messages');

  return (
    <Callout variant="danger">
      <Callout.Title>{t('errorTitle')}</Callout.Title>
      <Callout.Content>{t('errorContent')}</Callout.Content>
    </Callout>
  );
}
