'use client';

import { Field } from '../../components/field';
import { Radio } from '../../components/radio';

const plans = [
  { value: 'hobby', title: 'Hobby', detail: 'Free, one project, community support' },
  { value: 'pro', title: 'Pro', detail: '$20 per user, unlimited projects' },
  { value: 'team', title: 'Team', detail: '$48 per user, SSO and audit log' },
];

export function Fieldset() {
  return (
    <Field.Set className="w-full max-w-sm">
      <Field.Legend>Plan</Field.Legend>
      <Field.Description className="-mt-4">
        You can change this at any time from billing.
      </Field.Description>
      <Field.Group className="gap-3">
        {plans.map((plan) => (
          <Field
            key={plan.value}
            orientation="horizontal"
            id={`plan-${plan.value}`}
            className="border-border bg-card rounded-lg border p-3"
          >
            <Field.Control>
              <Radio name="plan" value={plan.value} defaultChecked={plan.value === 'pro'} />
            </Field.Control>
            <Field.Content>
              <Field.Label>{plan.title}</Field.Label>
              <Field.Description>{plan.detail}</Field.Description>
            </Field.Content>
          </Field>
        ))}
      </Field.Group>
    </Field.Set>
  );
}
