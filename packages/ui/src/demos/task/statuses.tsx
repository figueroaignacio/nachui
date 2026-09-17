'use client';

import { Task } from '../../ai/task';

export function Statuses() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Task defaultOpen={false}>
        <Task.Trigger title="Read the docs" status="complete" />
        <Task.Content>
          <Task.Item>Fetched 12 pages from llms.txt</Task.Item>
        </Task.Content>
      </Task>
      <Task defaultOpen>
        <Task.Trigger title="Generating the component" status="active" />
        <Task.Content>
          <Task.Item>
            Writing
            <Task.File>prompt-input.tsx</Task.File>
          </Task.Item>
        </Task.Content>
      </Task>
      <Task defaultOpen={false}>
        <Task.Trigger title="Run the test suite" status="pending" />
        <Task.Content>
          <Task.Item>Waiting for the previous step</Task.Item>
        </Task.Content>
      </Task>
      <Task defaultOpen>
        <Task.Trigger title="Type check" status="error" />
        <Task.Content>
          <Task.Item>2 errors in the generated registry</Task.Item>
        </Task.Content>
      </Task>
    </div>
  );
}
