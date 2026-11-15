'use client';

import { Button } from '@repo/ui/components/button';
import { Tooltip } from '@repo/ui/components/tooltip';
import { Typography } from '@repo/ui/components/typography';
import { MessagePlusIcon } from '@repo/ui/icons/message-plus';
import { TrashIcon } from '@repo/ui/icons/trash';
import { XIcon } from '@repo/ui/icons/x';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';

const CONFIRM_TIMEOUT = 3000;

interface ChatHeaderProps {
  onClose?: () => void;
  onReset?: () => void;
  canReset?: boolean;
  /** The first click on «new chat» asks for a second one before clearing. */
  confirming: boolean;
  onConfirmingChange: (confirming: boolean) => void;
}

export function ChatHeader({
  onClose,
  onReset,
  canReset = true,
  confirming,
  onConfirmingChange,
}: ChatHeaderProps) {
  const t = useTranslations('components.chat');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    onConfirmingChange(false);
  }, [onConfirmingChange]);

  useEffect(() => {
    if (!confirming) return;
    timeoutRef.current = setTimeout(cancel, CONFIRM_TIMEOUT);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      cancel();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [confirming, cancel]);

  if (!onClose) return null;

  return (
    <header className="border-rule border-b">
      <div className="flex h-14 items-center justify-between gap-3 ps-5 pe-3">
        <p className="min-w-0 truncate text-sm font-medium">{t('label')}</p>
        <div className="flex shrink-0 items-center gap-1">
          {onReset &&
            (confirming ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  cancel();
                  onReset();
                }}
                leftIcon={<TrashIcon size={13} aria-hidden="true" />}
                className="border-destructive-border bg-destructive-surface text-destructive-text hover:bg-destructive-surface/80 h-8 px-3 max-md:h-11"
              >
                {t('header.clear')}
              </Button>
            ) : (
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <Button
                    onClick={() => onConfirmingChange(true)}
                    size="icon"
                    variant="ghost"
                    disabled={!canReset}
                    className="size-8 max-md:size-11"
                    aria-label={t('header.reset')}
                  >
                    <MessagePlusIcon size={15} />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">
                  <Typography variant="small" className="text-secondary">
                    {t('header.reset')}
                  </Typography>
                </Tooltip.Content>
              </Tooltip>
            ))}
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button
                onClick={onClose}
                size="icon"
                variant="ghost"
                className="size-8 max-md:size-11"
                aria-label={t('header.close')}
              >
                <XIcon size={15} />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
              <Typography variant="small" className="text-secondary">
                {t('header.close')}
              </Typography>
            </Tooltip.Content>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
