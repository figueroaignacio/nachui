'use client';

import { CodeBlock } from '../../ai/code-block';

const CODE = `import { CodeBlock } from '@/components/ui/code-block';

export function Snippet() {
  return (
    <CodeBlock code={source} language="tsx" filename="snippet.tsx">
      <CodeBlock.Header>
        <CodeBlock.CopyButton />
      </CodeBlock.Header>
      <CodeBlock.Content />
    </CodeBlock>
  );
}`;

export function Default() {
  return (
    <div className="w-full max-w-lg">
      <CodeBlock code={CODE} language="tsx" filename="snippet.tsx" showLineNumbers>
        <CodeBlock.Header>
          <CodeBlock.CopyButton />
        </CodeBlock.Header>
        <CodeBlock.Content />
      </CodeBlock>
    </div>
  );
}
