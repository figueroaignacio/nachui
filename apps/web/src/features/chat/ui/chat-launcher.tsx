'use client';

import { ArrowUp01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState, type RefObject } from 'react';

interface ChatLauncherProps {
  message: string;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  hasConversation: boolean;
  onMessageChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onOpen: () => void;
}

const launcherVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
} as const;

const launcherTransition = {
  type: 'spring' as const,
  stiffness: 480,
  damping: 34,
  mass: 0.6,
};

const SHELL =
  'bg-background/85 border-rule w-[min(22rem,calc(100vw-2rem))] rounded-2xl border px-4 py-3 text-left backdrop-blur-md transition-colors duration-200';

export function ChatLauncher(props: ChatLauncherProps) {
  const { message, inputRef, hasConversation, onMessageChange, onSubmit, onKeyDown, onOpen } =
    props;
  const t = useTranslations('components.chat.launcher');
  const [isFocused, setIsFocused] = useState(false);
  const reduceMotion = useReducedMotion();

  const showHint = !isFocused && message.length === 0;
  const canSend = message.trim().length > 0;

  return (
    <motion.div
      variants={launcherVariants}
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      exit={reduceMotion ? { opacity: 0 } : 'exit'}
      transition={reduceMotion ? { duration: 0 } : launcherTransition}
    >
      {hasConversation ? (
        <button type="button" onClick={onOpen} className={cn(SHELL, 'hover:border-foreground/25')}>
          <span className="text-muted-foreground/80 block text-sm leading-relaxed">
            {t('resume')}
          </span>
          <span className="mt-1 flex items-center justify-end gap-3">
            <span className="text-muted-foreground/70 font-mono text-[11px]">{t('shortcut')}</span>
            <span className="text-muted-foreground flex size-5 shrink-0 items-center justify-center">
              <HugeiconsIcon icon={ArrowUp01Icon} size={16} aria-hidden="true" />
            </span>
          </span>
        </button>
      ) : (
        <form onSubmit={onSubmit} className={cn(SHELL, isFocused && 'border-foreground/25')}>
          <textarea
            ref={inputRef}
            rows={1}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t('placeholder')}
            aria-label={t('placeholder')}
            className="placeholder:text-muted-foreground/80 max-h-32 w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
          />
          <div className="mt-1 flex items-center justify-end gap-3">
            {showHint && (
              <span className="text-muted-foreground/70 font-mono text-[11px]">
                {t('shortcut')}
              </span>
            )}
            <button
              type="submit"
              disabled={!canSend}
              aria-label={t('send')}
              className="text-muted-foreground hover:text-foreground flex size-5 shrink-0 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
            >
              <HugeiconsIcon icon={ArrowUp01Icon} size={16} aria-hidden="true" />
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
