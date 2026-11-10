'use client';

import { Subagent } from '../../ai/subagent';
import { Terminal } from '../../ai/terminal';
import { Tool } from '../../ai/tool';

export function Default() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Subagent defaultOpen>
        <Subagent.Header
          name="code-explorer"
          task="Find where the discount is applied"
          meta="2 tools · 9s"
        />
        <Subagent.Content>
          <Tool>
            <Tool.Header name="grep" description="applyDiscount in src/" />
          </Tool>
          <Tool>
            <Tool.Header name="read_file" description="src/checkout/total.ts" />
          </Tool>
          <Subagent.Result>
            The discount runs in applyDiscount, after the subtotal is rounded on line 38. Rounding
            once, after tax, fixes the missing cent.
          </Subagent.Result>
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
