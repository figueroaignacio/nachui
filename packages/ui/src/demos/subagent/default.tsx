'use client';

import { Subagent } from '../../ai/subagent';
import { Terminal } from '../../ai/terminal';
import { Tool } from '../../ai/tool';
import { usePlayback } from '../../lib/use-playback';

export function Default() {
  const { step, playing, rootProps } = usePlayback(4, 1000);

  return (
    <div {...rootProps} className="flex min-h-96 w-full max-w-xl flex-col gap-2">
      <Subagent defaultOpen status={playing ? 'running' : 'complete'}>
        <Subagent.Header
          name="code-explorer"
          task="Find where the discount is applied"
          meta={playing ? `${Math.min(step, 2)} tools` : '2 tools · 9s'}
        />
        <Subagent.Content>
          {step >= 1 ? (
            <Tool status={step === 1 ? 'running' : 'complete'}>
              <Tool.Header name="grep" description="applyDiscount in src/" />
            </Tool>
          ) : null}
          {step >= 2 ? (
            <Tool status={step === 2 ? 'running' : 'complete'}>
              <Tool.Header name="read_file" description="src/checkout/total.ts" />
            </Tool>
          ) : null}
          {step >= 4 ? (
            <Subagent.Result>
              The discount runs in applyDiscount, after the subtotal is rounded on line 38. Rounding
              once, after tax, fixes the missing cent.
            </Subagent.Result>
          ) : null}
        </Subagent.Content>
      </Subagent>
      <Subagent status="running">
        <Subagent.Header name="test-runner" task="Run the checkout suite" meta="1 tool · 4s" />
        <Subagent.Content>
          <Terminal
            command="pnpm test src/checkout"
            output={' RUN  v4.1.8 /app\n\n ✓ src/checkout/cart.test.ts (6 tests) 14ms'}
            status="running"
          >
            <Terminal.Header />
            <Terminal.Content />
          </Terminal>
        </Subagent.Content>
      </Subagent>
    </div>
  );
}
