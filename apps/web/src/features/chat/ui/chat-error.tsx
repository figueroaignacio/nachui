import { RefreshIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Callout } from '@repo/ui/components/callout';
import { useTranslations } from 'next-intl';
import type { ChatErrorCode } from '../lib/chat-error';
import { AiPerch } from './ai-perch';

interface ChatErrorProps {
  code: ChatErrorCode | null;
  onRetry?: () => void;
}

const WITH_COPY = new Set<string>(['offline', 'rate_limit', 'auth', 'timeout', 'upstream']);

export function ChatError({ code, onRetry }: ChatErrorProps) {
  const t = useTranslations('components.chat.errors');

  const key = code && WITH_COPY.has(code) ? code : 'unknown';

  const canRetry = onRetry !== undefined && key !== 'auth' && key !== 'rate_limit';

  return (
    <div className="relative">
      <AiPerch className="ai-edge-perch" expression="startled" />
      <Callout variant="danger">
        <Callout.Title>{t(`${key}.title`)}</Callout.Title>
        <Callout.Content>
          <p>{t(`${key}.body`)}</p>
          {canRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-foreground/80 hover:text-foreground mt-3 inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4 transition-colors"
            >
              <HugeiconsIcon icon={RefreshIcon} size={13} aria-hidden="true" />
              {t('retry')}
            </button>
          )}
        </Callout.Content>
      </Callout>
    </div>
  );
}
