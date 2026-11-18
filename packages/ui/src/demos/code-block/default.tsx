'use client';

import { CodeBlock } from '../../ai/code-block';
import { usePlayback } from '../../lib/use-playback';

const LINES = [
  "import { CodeBlock } from '@/components/ui/code-block';",
  '',
  'export function Snippet() {',
  '  return (',
  '    <CodeBlock code={source} language="tsx">',
  '      <CodeBlock.CopyButton />',
  '      <CodeBlock.Content />',
  '    </CodeBlock>',
  '  );',
  '}',
];

export function Default() {
  const { step, rootProps } = usePlayback(LINES.length, 160);

  return (
    <div {...rootProps} className="min-h-64 w-full max-w-lg">
      <CodeBlock code={LINES.slice(0, Math.max(step, 1)).join('\n')} language="tsx" showLineNumbers>
        <CodeBlock.CopyButton />
        <CodeBlock.Content />
      </CodeBlock>
    </div>
  );
}
