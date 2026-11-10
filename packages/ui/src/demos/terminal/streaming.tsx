'use client';

import { useEffect, useState } from 'react';
import { Terminal } from '../../ai/terminal';
import { Button } from '../../components/button';

const LINES = [
  '> next build',
  '',
  '   ▲ Next.js 16.0.1',
  '   Creating an optimized production build ...',
  ' ✓ Compiled successfully in 8.4s',
  ' ✓ Linting and checking validity of types',
  ' ✓ Collecting page data',
  ' ✓ Generating static pages (42/42)',
  ' ✓ Finalizing page optimization',
  '',
  'Route (app)                Size  First Load JS',
  '┌ ○ /                     5.2 kB         112 kB',
  '├ ○ /checkout             8.9 kB         118 kB',
  '└ ○ /orders               4.1 kB         110 kB',
];

export function Streaming() {
  const [count, setCount] = useState(1);
  const running = count < LINES.length;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setCount((value) => value + 1), 350);
    return () => clearTimeout(timer);
  }, [count, running]);

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      <Terminal
        command="pnpm build"
        output={LINES.slice(0, count).join('\n')}
        status={running ? 'running' : 'complete'}
        exitCode={running ? undefined : 0}
        duration={running ? undefined : '12.6s'}
        className="w-full"
      >
        <Terminal.Header>
          <Terminal.CopyButton />
        </Terminal.Header>
        <Terminal.Content className="h-56" />
      </Terminal>
      <Button variant="outline" size="sm" disabled={running} onClick={() => setCount(1)}>
        Run again
      </Button>
    </div>
  );
}
