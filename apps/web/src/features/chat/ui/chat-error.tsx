import { Callout } from '@repo/ui/components/callout';
import { useTranslations } from 'next-intl';
import { AiPerch } from './ai-perch';

export function ChatError() {
  const t = useTranslations('components.chat.messages');

  return (
    <div className="relative">
      <AiPerch className="ai-edge-perch" expression="startled" />
      <Callout variant="danger">
        <Callout.Title>{t('errorTitle')}</Callout.Title>
        <Callout.Content>{t('errorContent')}</Callout.Content>
      </Callout>
    </div>
  );
}
