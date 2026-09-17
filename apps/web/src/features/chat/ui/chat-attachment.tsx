'use client';

import { Attachments } from '@repo/ui/ai/attachments';
import { FileIcon } from '@repo/ui/icons/file';
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
    <Attachments variant="inline" className={cn('w-auto', className)}>
      <Attachments.Item
        data={{ id: 'selection', filename: preview }}
        onRemove={onRemove}
        title={collapsed}
        className="border-rule text-muted-foreground max-w-full"
      >
        <Attachments.Preview
          className="size-5 bg-transparent"
          fallbackIcon={<FileIcon size={12} aria-hidden="true" />}
        />
        <Attachments.Info className="min-w-0" />
        {onRemove && <Attachments.Remove label={t('remove')} className="border-none" />}
      </Attachments.Item>
    </Attachments>
  );
}
