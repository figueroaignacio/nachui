import { Cancel01Icon, File01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '@repo/ui/components/badge';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

interface ChatAttachmentProps {
  text: string;
  onRemove?: () => void;
  className?: string;
}

const MAX_CHARS = 18;

export function ChatAttachment({ text, onRemove, className }: ChatAttachmentProps) {
  const t = useTranslations('components.chat.selection');

  const collapsed = text.replace(/\s+/g, ' ').trim();
  const preview =
    collapsed.length > MAX_CHARS ? `${collapsed.slice(0, MAX_CHARS).trimEnd()}...` : collapsed;

  return (
    <Badge
      variant="outline"
      title={collapsed}
      className={cn(
        'border-rule text-muted-foreground max-w-full gap-1.5 rounded-md px-2 py-1 font-normal tracking-normal',
        className,
      )}
    >
      <HugeiconsIcon icon={File01Icon} size={12} className="shrink-0" aria-hidden="true" />
      <span className="truncate">{preview}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={t('remove')}
          className="hover:text-foreground -mr-0.5 shrink-0 transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={11} aria-hidden="true" />
        </button>
      )}
    </Badge>
  );
}
