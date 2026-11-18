'use client';

import { Terminal } from '../../ai/terminal';
import { usePlayback } from '../../lib/use-playback';

const LINES = [
  ' RUN  v4.1.8 /app',
  '',
  ' ✓ src/checkout/cart.test.ts (6 tests) 14ms',
  ' ✓ src/checkout/tax.test.ts (6 tests) 9ms',
  ' × src/checkout/total.test.ts > applies the discount before tax',
  '   → expected 107.09 to be 107.1',
  '',
  ' Tests  1 failed | 12 passed (13)',
  ' Duration  4.21s',
];

export function Default() {
  const { step, playing, rootProps } = usePlayback(LINES.length, 380);

  return (
    <div {...rootProps} className="w-full max-w-xl">
      <Terminal
        command="pnpm test src/checkout"
        output={LINES.slice(0, Math.max(step, 1)).join('\n')}
        status={playing ? 'running' : 'complete'}
        exitCode={playing ? undefined : 1}
        duration={playing ? undefined : '4.2s'}
      >
        <Terminal.Header>
          <Terminal.CopyButton />
        </Terminal.Header>
        <Terminal.Content className="h-60" />
      </Terminal>
    </div>
  );
}
