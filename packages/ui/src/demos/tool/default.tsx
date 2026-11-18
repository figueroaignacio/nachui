'use client';

import { Tool, type ToolStatus } from '../../ai/tool';
import { usePlayback } from '../../lib/use-playback';

const input = { query: 'applyDiscount', path: 'src/checkout' };

const output = [
  { file: 'src/checkout/total.ts', line: 38, match: 'return round(applyDiscount(subtotal))' },
  { file: 'src/checkout/discount.ts', line: 12, match: 'export function applyDiscount(amount)' },
  { file: 'src/checkout/total.test.ts', line: 18, match: 'applies the discount before tax' },
];

export function Default() {
  const { step, rootProps } = usePlayback(34);
  const status: ToolStatus = step < 6 ? 'pending' : step < 30 ? 'running' : 'complete';

  return (
    <div {...rootProps} className="w-full max-w-md">
      <Tool status={status} defaultOpen>
        <Tool.Header name="search_code" description="Finds where a symbol is used" />
        <Tool.Content>
          <Tool.Input value={input} />
          {status === 'complete' ? <Tool.Output value={output} /> : null}
        </Tool.Content>
      </Tool>
    </div>
  );
}
