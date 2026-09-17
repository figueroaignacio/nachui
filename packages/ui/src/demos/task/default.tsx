'use client';

import { Task } from '../../ai/task';

export function Default() {
  return (
    <div className="w-full max-w-md">
      <Task defaultOpen>
        <Task.Trigger title="Scanned the component registry" status="complete" />
        <Task.Content>
          <Task.Item>Read 58 components across two families</Task.Item>
          <Task.Item>
            Matched the request to
            <Task.File>button.tsx</Task.File>
            and
            <Task.File>field.tsx</Task.File>
          </Task.Item>
          <Task.Item>Wrote the demo and regenerated the registry</Task.Item>
        </Task.Content>
      </Task>
    </div>
  );
}
