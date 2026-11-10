'use client';

import { useEffect, useState } from 'react';
import { Plan, type PlanStepStatus } from '../../ai/plan';
import { Button } from '../../components/button';

const STEPS = [
  'Read the failing test',
  'Find where the discount is rounded',
  'Round once, after tax',
  'Run the checkout suite',
];

export function Live() {
  const [current, setCurrent] = useState(0);
  const done = current >= STEPS.length;

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(() => setCurrent((value) => value + 1), 1400);
    return () => clearTimeout(timer);
  }, [current, done]);

  const statusOf = (index: number): PlanStepStatus =>
    index < current ? 'complete' : index === current ? 'active' : 'pending';

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <Plan>
        <Plan.Header
          title="Fix the failing checkout test"
          completed={Math.min(current, STEPS.length)}
          total={STEPS.length}
        />
        <Plan.Content>
          {STEPS.map((step, index) => (
            <Plan.Step key={step} status={statusOf(index)}>
              {step}
            </Plan.Step>
          ))}
        </Plan.Content>
      </Plan>
      <Button variant="outline" size="sm" disabled={!done} onClick={() => setCurrent(0)}>
        Run again
      </Button>
    </div>
  );
}
