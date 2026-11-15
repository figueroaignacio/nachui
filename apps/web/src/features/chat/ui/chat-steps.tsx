'use client';

import type { ChatStep } from '@/lib/definitions';
import { ChainOfThought } from '@repo/ui/ai/chain-of-thought';
import { Shimmer } from '@repo/ui/ai/shimmer';
import { CheckIcon } from '@repo/ui/icons/check';
import { XIcon } from '@repo/ui/icons/x';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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

function StepDetail({ children }: { children?: string }) {
  if (!children) return null;
  return <span className="text-muted-foreground ms-1.5 font-mono text-xs">{children}</span>;
}

function StepList({ steps, thinking }: { steps: ChatStep[]; thinking: boolean }) {
  const t = useTranslations('components.chat.messages');

  return (
    <ChainOfThought.Content>
      {steps.map((step) => {
        if (step.status === 'active') {
          return (
            <ChainOfThought.Step
              key={step.id}
              status="active"
              label={
                <span className="text-xs font-normal">
                  <Shimmer as="span">{`${t(`tools.${step.tool}`)}…`}</Shimmer>
                  <StepDetail>{step.detail}</StepDetail>
                </span>
              }
            />
          );
        }

        const failed = step.status === 'error';

        return (
          <ChainOfThought.Step
            key={step.id}
            status="complete"
            icon={failed ? XIcon : CheckIcon}
            label={
              <span className="text-muted-foreground text-xs font-normal">
                {failed ? t(`toolsError.${step.tool}`) : t(`toolsDone.${step.tool}`)}
                <StepDetail>{step.detail}</StepDetail>
              </span>
            }
          >
            {step.pages && step.pages.length > 0 && (
              <ChainOfThought.SearchResults>
                {step.pages.map((page) => (
                  <ChainOfThought.SearchResult key={page.slug} className="text-xs">
                    {page.title}
                  </ChainOfThought.SearchResult>
                ))}
              </ChainOfThought.SearchResults>
            )}
          </ChainOfThought.Step>
        );
      })}
      {thinking && (
        <ChainOfThought.Step
          status="active"
          label={<Shimmer as="span" className="text-xs font-normal">{`${t('thinking')}…`}</Shimmer>}
        />
      )}
    </ChainOfThought.Content>
  );
}

/**
 * The turn while the agent works and nothing is written yet. With no tool call
 * it is one quiet line; once it calls tools, every step shows what it found and
 * the elapsed time, so a long search reads as progress instead of a hang.
 */
export function ChatWorking({ steps }: { steps: ChatStep[] }) {
  const t = useTranslations('components.chat.messages');
  const seconds = useElapsedSeconds();

  if (steps.length === 0) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm">
        <span aria-hidden="true" className="bg-brand size-1.5 shrink-0 rounded-full" />
        <Shimmer as="span" className="font-normal">{`${t('thinking')}…`}</Shimmer>
      </p>
    );
  }

  const thinking = steps.every((step) => step.status !== 'active');

  return (
    <ChainOfThought defaultOpen className="w-full min-w-0">
      <ChainOfThought.Header className="w-fit text-xs font-medium">
        <Shimmer as="span">{t('working')}</Shimmer>
        {seconds > 0 && <span className="font-normal tabular-nums">{` · ${seconds}s`}</span>}
      </ChainOfThought.Header>
      <StepList steps={steps} thinking={thinking} />
    </ChainOfThought>
  );
}

/** The finished steps, folded into one line above the answer. */
export function ChatThought({ steps, seconds }: { steps: ChatStep[]; seconds?: number }) {
  const t = useTranslations('components.chat.messages');
  const count = t('steps', { count: steps.length });

  return (
    <ChainOfThought className="w-full min-w-0">
      <ChainOfThought.Header className="w-fit text-xs font-medium">
        {seconds ? t('thoughtFor', { seconds }) : count}
        {seconds ? <span className="font-normal">{` · ${count}`}</span> : null}
      </ChainOfThought.Header>
      <StepList steps={steps} thinking={false} />
    </ChainOfThought>
  );
}
