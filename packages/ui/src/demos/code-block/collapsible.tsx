'use client';

import { CodeBlock } from '../../ai/code-block';

const CODE = Array.from({ length: 24 }, (_, index) =>
  index === 0
    ? 'export const steps = ['
    : index === 23
      ? '];'
      : `  { id: ${index}, label: 'Step ${index}', done: ${index < 12} },`,
).join('\n');

export function Collapsible() {
  return (
    <div className="w-full max-w-lg">
      <CodeBlock code={CODE} language="ts" filename="steps.ts" collapsible maxLines={8}>
        <CodeBlock.Header>
          <CodeBlock.CopyButton />
        </CodeBlock.Header>
        <CodeBlock.Content />
        <CodeBlock.Expand />
      </CodeBlock>
    </div>
  );
}
