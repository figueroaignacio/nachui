'use client';

import { Plan } from '../../ai/plan';

export function Default() {
  return (
    <Plan className="max-w-md">
      <Plan.Header title="Fix the failing checkout test" completed={2} total={5} />
      <Plan.Content>
        <Plan.Step status="complete">Reproduce the failure</Plan.Step>
        <Plan.Step status="complete">Find where the discount is rounded</Plan.Step>
        <Plan.Step status="active" description="pnpm test src/checkout">
          Run the checkout suite
        </Plan.Step>
        <Plan.Step>Update the changelog</Plan.Step>
        <Plan.Step>Open the pull request</Plan.Step>
      </Plan.Content>
    </Plan>
  );
}
