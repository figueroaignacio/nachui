'use client';

import { useEffect, useRef, useState } from 'react';
import { AgentRun, type AgentRunStatus, type AgentStep } from '../../hybrids/agent-run';

const PLAN: AgentStep[] = [
  { id: 'read', title: 'Read the docs page', status: 'pending', detail: 'Fetching llms.txt' },
  {
    id: 'find',
    title: 'Find the component',
    status: 'pending',
    reasoning: 'The request mentions a composer with attachments, which matches prompt-input.',
    tools: [
      {
        id: 'search',
        name: 'search_registry',
        status: 'complete',
        input: { query: 'composer attachments' },
        output: { slug: 'ai/prompt-input', score: 0.93 },
      },
    ],
  },
  {
    id: 'install',
    title: 'Install it',
    status: 'pending',
    files: ['prompt-input.tsx', 'attachments.tsx'],
  },
  { id: 'verify', title: 'Type check', status: 'pending', detail: 'tsc --noEmit' },
];

const ANSWER =
  'Installed prompt-input and attachments into components/ui. The type check passes and the demo is on the page.';

const STEP_MS = 1400;
const CHAR_MS = 18;

export function Live() {
  const [status, setStatus] = useState<AgentRunStatus>('idle');
  const [steps, setSteps] = useState<AgentStep[]>(PLAN);
  const [answer, setAnswer] = useState('');
  const [startedAt, setStartedAt] = useState<number | undefined>();
  const [finishedAt, setFinishedAt] = useState<number | undefined>();
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  useEffect(() => clear, []);

  const start = () => {
    clear();
    setStatus('running');
    setSteps(PLAN.map((step, index) => ({ ...step, status: index === 0 ? 'active' : 'pending' })));
    setAnswer('');
    setStartedAt(Date.now());
    setFinishedAt(undefined);

    PLAN.forEach((_, index) => {
      timers.current.push(
        window.setTimeout(
          () => {
            setSteps((current) =>
              current.map((step, position) => {
                if (position <= index) return { ...step, status: 'complete' };
                if (position === index + 1) return { ...step, status: 'active' };
                return step;
              }),
            );
          },
          STEP_MS * (index + 1),
        ),
      );
    });

    const answerStart = STEP_MS * (PLAN.length + 1);
    for (let index = 1; index <= ANSWER.length; index += 1) {
      timers.current.push(
        window.setTimeout(() => setAnswer(ANSWER.slice(0, index)), answerStart + CHAR_MS * index),
      );
    }
    timers.current.push(
      window.setTimeout(
        () => {
          setStatus('complete');
          setFinishedAt(Date.now());
        },
        answerStart + CHAR_MS * ANSWER.length + 200,
      ),
    );
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <button
        type="button"
        onClick={start}
        disabled={status === 'running'}
        className="border-border hover:bg-muted w-fit rounded-full border px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
      >
        {status === 'running' ? 'Running' : status === 'complete' ? 'Run again' : 'Start the run'}
      </button>
      <AgentRun
        title="Adding a composer to the docs"
        status={status}
        steps={steps}
        startedAt={startedAt}
        finishedAt={finishedAt}
        answer={answer ? <p>{answer}</p> : undefined}
      />
    </div>
  );
}
