'use client';

import { CodeBlock } from '../../ai/code-block';

const CODE = `import { CodeBlock } from '@/components/ui/code-block';

export function Snippet() {
  return (
    <CodeBlock code={source} language="tsx">
      <CodeBlock.CopyButton />
      <CodeBlock.Content />
    </CodeBlock>
  );
}`;

export function Default() {
  return (
    <div className="w-full max-w-lg">
      <CodeBlock code={CODE} language="tsx" showLineNumbers>
        <CodeBlock.CopyButton />
        <CodeBlock.Content />
      </CodeBlock>
    </div>
  );
}
