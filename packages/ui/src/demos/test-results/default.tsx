'use client';

import { TestResults } from '../../ai/test-results';
import { usePlayback } from '../../lib/use-playback';

const PASSED = [0, 5, 8, 12];

export function Default() {
  const { step, playing, rootProps } = usePlayback(3, 1100);
  const finished = step >= 3;

  return (
    <div {...rootProps} className="min-h-96 w-full max-w-xl">
      <TestResults
        summary={{
          passed: PASSED[step] ?? 12,
          failed: finished ? 1 : 0,
          skipped: finished ? 1 : 0,
        }}
      >
        <TestResults.Header duration={playing ? undefined : '4.2s'}>
          src/checkout
        </TestResults.Header>
        <TestResults.Summary />
        <TestResults.Suites>
          <TestResults.Suite name="total.test.ts" status={finished ? 'failed' : 'running'}>
            {finished ? (
              <>
                <TestResults.Test name="sums line items" duration="3ms" />
                <TestResults.Test name="applies tax per region" duration="4ms" />
                <TestResults.Test
                  name="applies the discount before tax"
                  status="failed"
                  duration="6ms"
                >
                  <TestResults.Error>{`AssertionError: expected 107.09 to be 107.1
  at src/checkout/total.test.ts:18:5`}</TestResults.Error>
                </TestResults.Test>
                <TestResults.Test name="rounds to the currency" status="skipped" />
              </>
            ) : null}
          </TestResults.Suite>
          <TestResults.Suite name="cart.test.ts" status={step >= 1 ? 'passed' : 'running'}>
            <TestResults.Test name="adds an item" duration="2ms" />
            <TestResults.Test name="merges the same item" duration="2ms" />
          </TestResults.Suite>
          <TestResults.Suite name="tax.test.ts" status={step >= 2 ? 'passed' : 'running'}>
            <TestResults.Test name="uses the shipping address" duration="5ms" />
          </TestResults.Suite>
        </TestResults.Suites>
      </TestResults>
    </div>
  );
}
