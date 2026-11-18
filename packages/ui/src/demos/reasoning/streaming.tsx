'use client';

import { useState } from 'react';
import { Reasoning } from '../../ai/reasoning';

export function Streaming() {
  const [streaming, setStreaming] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <button
        type="button"
        onClick={() => setStreaming((previous) => !previous)}
        className="bg-card hover:bg-muted w-fit rounded-full px-3 py-1.5 text-xs shadow-sm transition-colors"
      >
        {streaming ? 'Stop streaming' : 'Start streaming'}
      </button>
      <Reasoning isStreaming={streaming} defaultOpen={false}>
        <Reasoning.Trigger />
        <Reasoning.Content>
          The panel opens on its own while the model is thinking and closes once the answer starts,
          keeping the reasoning one click away instead of in the way.
        </Reasoning.Content>
      </Reasoning>
    </div>
  );
}
