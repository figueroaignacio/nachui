'use client';

import { Task } from '../../ai/task';
import { usePlayback } from '../../lib/use-playback';

export function Default() {
  const { step, playing, rootProps } = usePlayback(4, 900);

  return (
    <div {...rootProps} className="w-full max-w-md">
      <Task defaultOpen>
        <Task.Trigger
          title={playing ? 'Scanning the component registry' : 'Scanned the component registry'}
          status={playing ? 'active' : 'complete'}
        />
        <Task.Content>
          {step >= 1 ? <Task.Item>Read 58 components across two families</Task.Item> : null}
          {step >= 2 ? (
            <Task.Item>
              Matched the request to
              <Task.File>button.tsx</Task.File>
              and
              <Task.File>field.tsx</Task.File>
            </Task.Item>
          ) : null}
          {step >= 3 ? <Task.Item>Wrote the demo and regenerated the registry</Task.Item> : null}
        </Task.Content>
      </Task>
    </div>
  );
}
