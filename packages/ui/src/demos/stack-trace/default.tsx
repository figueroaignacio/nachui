'use client';

import { useState } from 'react';
import { StackTrace, type StackFrame } from '../../ai/stack-trace';

const STACK = `TypeError: Cannot read properties of undefined (reading 'amount')
    at applyDiscount (src/checkout/total.ts:42:11)
    at getTotal (src/checkout/total.ts:18:5)
    at async POST (src/app/api/checkout/route.ts:24:17)
    at async Server.handler (node_modules/next/dist/server/base-server.js:812:9)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)`;

export function Default() {
  const [frame, setFrame] = useState<StackFrame | null>(null);

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <StackTrace stack={STACK}>
        <StackTrace.Header>
          <StackTrace.CopyButton />
        </StackTrace.Header>
        <StackTrace.Frames onFrameSelect={setFrame} />
      </StackTrace>
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {frame ? `Opening ${frame.file} at line ${frame.line}` : 'Pick a frame to open it.'}
      </p>
    </div>
  );
}
