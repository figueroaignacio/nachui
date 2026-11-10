'use client';

import { Terminal } from '../../ai/terminal';

const OUTPUT = ` RUN  v4.1.8 /app

 ✓ src/checkout/cart.test.ts (6 tests) 14ms
 ✓ src/checkout/tax.test.ts (6 tests) 9ms
 × src/checkout/total.test.ts > applies the discount before tax
   → expected 107.09 to be 107.1

 Tests  1 failed | 12 passed (13)
 Duration  4.21s`;

export function Default() {
  return (
    <Terminal
      command="pnpm test src/checkout"
      output={OUTPUT}
      exitCode={1}
      duration="4.2s"
      className="max-w-xl"
    >
      <Terminal.Header>
        <Terminal.CopyButton />
      </Terminal.Header>
      <Terminal.Content />
    </Terminal>
  );
}
