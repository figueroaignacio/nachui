'use client';

import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { ToolName } from '../hooks/use-chat';

interface ChatReasoningProps {
  /** When the agent is running a tool, name it instead of the generic label. */
  activeTool?: ToolName | null;
}

/**
 * The turn's thought process: every step the agent has taken so far, the
 * current one still pulsing. Tool execution (embeddings + DB lookups) is the
 * long silence in a turn — showing the trail reads as progress, not a hang.
 */
export function ChatReasoning({ activeTool }: ChatReasoningProps) {
  const t = useTranslations('components.chat.messages');
  const [steps, setSteps] = useState<string[]>([]);

  const current = activeTool ? t(`tools.${activeTool}`) : t('thinking');

  useEffect(() => {
    setSteps((previous) =>
      previous[previous.length - 1] === current ? previous : [...previous, current],
    );
  }, [current]);

  return (
    <div className="w-full min-w-0">
      <div>
        <p className="text-muted-foreground/70 font-mono text-[10px] tracking-[0.15em] uppercase">
          {t('reasoning')}
        </p>
        <ol className="mt-2 space-y-2">
          {steps.map((step, index) => {
            const isCurrent = index === steps.length - 1;

            return (
              <motion.li
                key={`${step}-${index}`}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-xs"
              >
                {isCurrent ? (
                  <span
                    aria-hidden="true"
                    className="bg-muted-foreground size-1.5 shrink-0 animate-pulse rounded-full"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    size={12}
                    className="text-muted-foreground/60 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className={isCurrent ? 'text-foreground/80' : 'text-muted-foreground/60'}>
                  {step}
                  {isCurrent && '…'}
                </span>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
