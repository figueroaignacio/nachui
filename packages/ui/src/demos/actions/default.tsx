'use client';

import { useState } from 'react';
import { Actions } from '../../ai/actions';
import { StreamText } from '../../lib/arrival';
import { usePlayback } from '../../lib/use-playback';

const ANSWER =
  'Keep the trigger and the region linked with aria-controls and aria-labelledby, and let the open state live in one place so both stay in sync.';

const WORDS = ANSWER.split(' ');

export function Default() {
  const { step, playing, rootProps } = usePlayback(WORDS.length + 3, 70);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);

  return (
    <div {...rootProps} className="flex min-h-28 w-full max-w-md flex-col gap-2">
      <p className="text-foreground/90 text-sm leading-relaxed">
        <StreamText text={WORDS.slice(0, step).join(' ')} />
      </p>
      <Actions className={playing ? 'invisible' : undefined}>
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
