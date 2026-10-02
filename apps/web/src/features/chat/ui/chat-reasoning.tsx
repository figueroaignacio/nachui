'use client';

import { ChainOfThought } from '@repo/ui/ai/chain-of-thought';
import { Shimmer } from '@repo/ui/ai/shimmer';
import { CheckIcon } from '@repo/ui/icons/check';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { ToolName } from '../hooks/use-chat';

interface ChatReasoningProps {
  /** When the agent is running a tool, name it instead of the generic label. */
  activeTool?: ToolName | null;
}

function useElapsedSeconds() {
  const [startedAt] = useState(() => Date.now());
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return seconds;
}

/**
 * The turn's thought process: every step the agent has taken so far, the
 * current one still shimmering. Tool execution (embeddings + DB lookups) is the
 * long silence in a turn, so showing the trail and the elapsed time reads as
 * progress instead of a hang.
 */
export function ChatReasoning({ activeTool }: ChatReasoningProps) {
  const t = useTranslations('components.chat.messages');
  const [steps, setSteps] = useState<string[]>([]);
  const seconds = useElapsedSeconds();

  const current = activeTool ? t(`tools.${activeTool}`) : t('thinking');

  useEffect(() => {
    setSteps((previous) =>
      previous[previous.length - 1] === current ? previous : [...previous, current],
    );
  }, [current]);

  return (
    <div className="w-full min-w-0">
      <ChainOfThought defaultOpen>
        <ChainOfThought.Header className="text-muted-foreground text-xs font-medium">
          <span>{t('reasoning')}</span>
          {seconds > 0 && (
            <span className="text-muted-foreground/70 font-normal tabular-nums">{` · ${seconds}s`}</span>
          )}
        </ChainOfThought.Header>
        <ChainOfThought.Content>
          {steps.map((step, index) => {
            const isCurrent = index === steps.length - 1;

            return (
              <ChainOfThought.Step
                key={`${step}-${index}`}
                status={isCurrent ? 'active' : 'complete'}
                icon={isCurrent ? undefined : CheckIcon}
                label={
                  isCurrent ? (
                    <Shimmer as="span" className="text-xs font-normal">{`${step}…`}</Shimmer>
                  ) : (
                    <span className="text-muted-foreground text-xs font-normal">{step}</span>
                  )
                }
              />
            );
          })}
        </ChainOfThought.Content>
      </ChainOfThought>
    </div>
  );
}
