'use client';

import { useState } from 'react';
import { Actions } from '../../ai/actions';

const ANSWER =
  'Keep the trigger and the region linked with aria-controls and aria-labelledby, and let the open state live in one place so both stay in sync.';

export function Default() {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <p className="text-foreground/90 text-sm leading-relaxed">{ANSWER}</p>
      <Actions>
        <Actions.Copy text={ANSWER} />
        <Actions.Button label="Retry">
          <Actions.Icons.retry />
        </Actions.Button>
        <Actions.Button
          label="Good response"
          active={vote === 'up'}
          onClick={() => setVote((current) => (current === 'up' ? null : 'up'))}
        >
          <Actions.Icons.thumbsUp />
        </Actions.Button>
        <Actions.Button
          label="Bad response"
          active={vote === 'down'}
          onClick={() => setVote((current) => (current === 'down' ? null : 'down'))}
        >
          <Actions.Icons.thumbsDown />
        </Actions.Button>
      </Actions>
    </div>
  );
}
