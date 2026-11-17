'use client';

import { Plan } from '@repo/ui/ai/plan';

export function PreviewAiPlan() {
  return (
    <Plan className="shadow-none">
      <Plan.Header title="A long weekend in Bariloche" completed={2} total={4} />
      <Plan.Content>
        <Plan.Step status="complete">Book the lakeside cabin</Plan.Step>
        <Plan.Step status="complete">Rent a car at the airport</Plan.Step>
        <Plan.Step status="active" description="Leaves at 9, back by sunset">
          Hike to the viewpoint
        </Plan.Step>
        <Plan.Step>Dinner by the dock</Plan.Step>
      </Plan.Content>
    </Plan>
  );
}
