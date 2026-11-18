'use client';

import { Plan, type PlanStepStatus } from '../../ai/plan';
import { usePlayback } from '../../lib/use-playback';

const STEPS = [
  { title: 'Reproduce the failure' },
  { title: 'Find where the discount is rounded' },
  { title: 'Run the checkout suite', description: 'pnpm test src/checkout' },
  { title: 'Update the changelog' },
  { title: 'Open the pull request' },
];

export function Default() {
  const { step, rootProps } = usePlayback(STEPS.length, 1100);

  const statusOf = (index: number): PlanStepStatus =>
    index < step ? 'complete' : index === step ? 'active' : 'pending';

  return (
    <div {...rootProps} className="w-full max-w-md">
      <Plan>
        <Plan.Header title="Fix the failing checkout test" completed={step} total={STEPS.length} />
        <Plan.Content>
          {STEPS.map((item, index) => (
            <Plan.Step key={item.title} status={statusOf(index)} description={item.description}>
              {item.title}
            </Plan.Step>
          ))}
        </Plan.Content>
      </Plan>
    </div>
  );
}
