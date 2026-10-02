'use client';

import { Shimmer } from '@repo/ui/ai/shimmer';
import { Button } from '@repo/ui/components/button';
import { Tooltip } from '@repo/ui/components/tooltip';
import { Typography } from '@repo/ui/components/typography';
import { CheckIcon } from '@repo/ui/icons/check';
import { MessagePlusIcon } from '@repo/ui/icons/message-plus';
import { XIcon } from '@repo/ui/icons/x';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToolName } from '../hooks/use-chat';
import { AiAvatar } from './ai-avatar';

interface ChatHeaderProps {
  onClose?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  activeTool?: ToolName | null;
}

export function ChatHeader({
  onClose,
  onReset,
  isLoading = false,
  isStreaming = false,
  activeTool = null,
}: ChatHeaderProps) {
  const t = useTranslations('components.chat.header');
  const tMessages = useTranslations('components.chat.messages');
  const [confirming, setConfirming] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isBusy = isLoading || activeTool !== null;
  const status = activeTool
    ? tMessages(`tools.${activeTool}`)
    : isStreaming
      ? tMessages('writing')
      : isBusy
        ? tMessages('thinking')
        : null;

  const clearResetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearResetTimeout();
  }, [clearResetTimeout]);

  const handleResetClick = useCallback(() => {
    if (confirming) {
      clearResetTimeout();
      setConfirming(false);
      onReset?.();
    } else {
      setConfirming(true);
      timeoutRef.current = setTimeout(() => {
        setConfirming(false);
      }, 2500);
    }
  }, [confirming, clearResetTimeout, onReset]);

  if (!onClose) return null;

  return (
    <header className="backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <AiAvatar size="md" busy={isBusy} />
          <p aria-live="polite" className="min-w-0 truncate text-xs">
            {status && (
              <Shimmer as="span" className="font-normal">
                {`${status}…`}
              </Shimmer>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onReset && (
            <Tooltip>
              <Tooltip.Trigger asChild>
                <Button
                  onClick={handleResetClick}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    'size-8 rounded-md transition-colors duration-200',
                    confirming && 'bg-destructive/10 text-destructive hover:bg-destructive/20',
                  )}
                  aria-label={confirming ? t('confirmReset') : t('reset')}
                >
                  {confirming ? (
                    <CheckIcon size={15} className="scale-110 transition-transform duration-200" />
                  ) : (
                    <MessagePlusIcon size={15} className="transition-transform duration-200" />
                  )}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side="bottom">
                <Typography variant="small" className="text-secondary">
                  {confirming ? t('confirmReset') : t('reset')}
                </Typography>
              </Tooltip.Content>
            </Tooltip>
          )}
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button
                onClick={onClose}
                size="icon"
                variant="ghost"
                className="size-8 rounded-md transition-colors"
                aria-label={t('close')}
              >
                <XIcon size={15} />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
              <Typography variant="small" className="text-secondary">
                {t('close')}
              </Typography>
            </Tooltip.Content>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
