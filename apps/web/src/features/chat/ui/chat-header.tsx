'use client';

import { Button } from '@repo/ui/components/button';
import { Tooltip } from '@repo/ui/components/tooltip';
import { Typography } from '@repo/ui/components/typography';
import { CheckIcon } from '@repo/ui/icons/check';
import { MaximizeIcon } from '@repo/ui/icons/maximize';
import { MessagePlusIcon } from '@repo/ui/icons/message-plus';
import { XIcon } from '@repo/ui/icons/x';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AiAvatar } from './ai-avatar';

interface ChatHeaderProps {
  onClose?: () => void;
  onReset?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function ChatHeader({ onClose, onReset, isExpanded, onToggleExpand }: ChatHeaderProps) {
  const t = useTranslations('components.chat.header');
  const [confirming, setConfirming] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      <div className="flex h-14 items-center justify-between px-4">
        <AiAvatar size="sm" />
        <div className="flex items-center gap-1">
          {onToggleExpand && (
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  onClick={onToggleExpand}
                  size="icon"
                  variant="ghost"
                  className="hidden size-8 rounded-md transition-all lg:flex"
                  aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
                >
                  <MaximizeIcon
                    size={15}
                    className={cn(
                      'transition-transform duration-300 ease-out',
                      isExpanded && 'rotate-180',
                    )}
                  />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side="bottom">
                <Typography variant="small" className="text-secondary">
                  {isExpanded ? t('collapse') : t('expand')}
                </Typography>
              </Tooltip.Content>
            </Tooltip>
          )}
          {onReset && (
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  onClick={handleResetClick}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    'size-8 rounded-md transition-all duration-200',
                    confirming && 'bg-destructive/10 text-destructive hover:bg-destructive/20',
                  )}
                  aria-label={confirming ? 'Confirm reset' : 'Reset chat'}
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
                  {t('reset')}
                </Typography>
              </Tooltip.Content>
            </Tooltip>
          )}
          <Tooltip>
            <Tooltip.Trigger>
              <Button
                onClick={onClose}
                size="icon"
                variant="ghost"
                className="size-8 rounded-md transition-all"
                aria-label="Close chat"
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
