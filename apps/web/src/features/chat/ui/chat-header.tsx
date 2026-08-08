'use client';

import { Cancel01Icon, ChatAdd01Icon, ExpandIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { Tooltip } from '@repo/ui/components/tooltip';
import { Typography } from '@repo/ui/components/typography';
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
    <header className="bg-background/80 flex items-center justify-between border-b px-6 py-3.5 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <AiAvatar size="sm" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        {onToggleExpand && (
          <Tooltip>
            <Tooltip.Trigger>
              <Button
                onClick={onToggleExpand}
                size="default"
                variant="ghost"
                className="hidden rounded-full transition-all lg:block"
                aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
              >
                <HugeiconsIcon
                  icon={ExpandIcon}
                  size={18}
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
                size="default"
                variant="ghost"
                className={cn(
                  'rounded-full transition-all duration-200',
                  confirming && 'bg-destructive/10 text-destructive hover:bg-destructive/20',
                )}
                aria-label={confirming ? 'Confirm reset' : 'Reset chat'}
              >
                <HugeiconsIcon
                  icon={confirming ? Tick02Icon : ChatAdd01Icon}
                  size={18}
                  className={cn('transition-transform duration-200', confirming && 'scale-110')}
                />
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
              size="default"
              variant="ghost"
              className="rounded-full transition-all"
              aria-label="Close chat"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">
            <Typography variant="small" className="text-secondary">
              {t('close')}
            </Typography>
          </Tooltip.Content>
        </Tooltip>
      </div>
    </header>
  );
}
