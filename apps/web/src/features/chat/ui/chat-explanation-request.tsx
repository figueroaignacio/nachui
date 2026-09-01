import { MagicWand01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { IconTile } from '@repo/ui/components/icon-tile';
import { useTranslations } from 'next-intl';

interface ChatExplanationRequestProps {
  componentName: string;
}

export function ChatExplanationRequest({ componentName }: ChatExplanationRequestProps) {
  const t = useTranslations('components');

  const shell =
    'bg-foreground text-background group relative max-w-[85%] overflow-hidden rounded-[24px] rounded-tr-sm p-0.5 text-[15px] shadow-sm';
  return (
    <div className={shell}>
      <div className="bg-foreground relative flex items-center gap-3 rounded-[22px] rounded-tr-xs px-4 py-3">
        <IconTile radius="full" className="bg-background size-9 border-0">
          <HugeiconsIcon icon={MagicWand01Icon} size={18} />
        </IconTile>
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
