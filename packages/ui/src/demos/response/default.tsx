'use client';

import { CodeBlock } from '../../ai/code-block';
import { Response } from '../../ai/response';

const CODE = `const answer = await model.generate({
  prompt: 'Summarise this thread',
  maxTokens: 200,
});`;

export function Default() {
  return (
    <div className="w-full max-w-lg">
      <Response>
        <p>
          You can keep the composer and the answer in the same column. Three things make it read
          well:
        </p>
        <ul>
          <li>
            Render markdown outside the component and pass the result as <code>children</code>.
          </li>
          <li>Keep code in a block with its own copy button.</li>
          <li>Show the caret only while tokens are still arriving.</li>
        </ul>
        <CodeBlock code={CODE} language="ts">
          <CodeBlock.CopyButton />
          <CodeBlock.Content />
        </CodeBlock>
      </Response>
    </div>
  );
}
