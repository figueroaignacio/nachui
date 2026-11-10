'use client';

import { TestResults } from '../../ai/test-results';

export function Default() {
  return (
    <TestResults summary={{ passed: 12, failed: 1, skipped: 1 }} className="max-w-xl">
      <TestResults.Header duration="4.2s">src/checkout</TestResults.Header>
      <TestResults.Summary />
      <TestResults.Suites>
        <TestResults.Suite name="total.test.ts" status="failed">
          <TestResults.Test name="sums line items" duration="3ms" />
          <TestResults.Test name="applies tax per region" duration="4ms" />
          <TestResults.Test name="applies the discount before tax" status="failed" duration="6ms">
            <TestResults.Error>{`AssertionError: expected 107.09 to be 107.1
  at src/checkout/total.test.ts:18:5`}</TestResults.Error>
          </TestResults.Test>
          <TestResults.Test name="rounds to the currency" status="skipped" />
        </TestResults.Suite>
        <TestResults.Suite name="cart.test.ts">
          <TestResults.Test name="adds an item" duration="2ms" />
          <TestResults.Test name="merges the same item" duration="2ms" />
        </TestResults.Suite>
        <TestResults.Suite name="tax.test.ts">
          <TestResults.Test name="uses the shipping address" duration="5ms" />
        </TestResults.Suite>
      </TestResults.Suites>
    </TestResults>
  );
}
