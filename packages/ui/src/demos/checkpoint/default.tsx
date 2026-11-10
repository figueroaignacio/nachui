'use client';

import { useState } from 'react';
import { Checkpoint } from '../../ai/checkpoint';
import { Bubble } from '../../components/bubble';
import { Message } from '../../components/message';

export function Default() {
  const [restored, setRestored] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Message align="end">
        <Message.Content>
          <Bubble>
            <Bubble.Content>Rename every Card prop from title to heading.</Bubble.Content>
          </Bubble>
        </Message.Content>
      </Message>
      <Checkpoint label="Before 12 files changed" onRestore={() => setRestored(true)} />
      <Message>
        <Message.Content>
          <Bubble variant="secondary">
            <Bubble.Content>
              {restored
                ? 'Restored. The 12 files are back to how they were before the rename.'
                : 'Done. I renamed the prop in 12 files and updated the docs.'}
            </Bubble.Content>
          </Bubble>
        </Message.Content>
      </Message>
    </div>
  );
}
