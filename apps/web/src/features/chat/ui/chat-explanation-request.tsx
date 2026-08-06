import { MagicWand01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

interface ChatExplanationRequestProps {
  componentName: string;
}

export function ChatExplanationRequest({ componentName }: ChatExplanationRequestProps) {
  const t = useTranslations('components');

  const newLocal =
    'bg-foreground text-background group relative max-w-[85%] overflow-hidden rounded-[24px] rounded-tr-sm p-0.5 text-[15px] shadow-sm';
  return (
    <div className={newLocal}>
      <div className="bg-foreground relative flex items-center gap-3 rounded-[22px] rounded-tr-xs px-4 py-3">
        <div className="bg-background text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
          <HugeiconsIcon icon={MagicWand01Icon} size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider">
            {t('chat.messages.promptSent')}
          </span>
          <span className="font-medium">
            {t('chat.messages.explainRequest', { component: componentName })}
          </span>
        </div>
      </div>
    </div>
  );
}
