'use client';

import * as React from 'react';
import { z } from 'zod';
import { Checkbox } from '../../components/checkbox';
import { Field } from '../../components/field';
import { Form } from '../../components/form';
import { Input } from '../../components/input';
import { Select } from '../../components/select';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.'),
  email: z.email('Enter an email like ada@northwind.dev.'),
  plan: z.enum(['hobby', 'pro', 'team'], { message: 'Pick a plan to continue.' }),
  password: z.string().min(8, 'Use at least 8 characters.'),
  terms: z.literal('yes', { message: 'Accept the terms to create an account.' }),
});

type Signup = z.infer<typeof schema>;

const plans = [
  { value: 'hobby', label: 'Hobby, free' },
  { value: 'pro', label: 'Pro, $20 per month' },
  { value: 'team', label: 'Team, $48 per user' },
];

export function Default() {
  const [account, setAccount] = React.useState<Signup | null>(null);

  return (
    <Form
      schema={schema}
      onSubmit={(data) => setAccount(data)}
      className="border-border bg-card w-full max-w-sm gap-5 rounded-xl border p-6"
    >
      <Form.ErrorSummary title="Check these fields" />
      <Form.Field name="name">
        <Field.Label>Full name</Field.Label>
        <Field.Control>
          <Input autoComplete="name" required />
        </Field.Control>
        <Field.Error />
      </Form.Field>
      <Form.Field name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <Input type="email" autoComplete="email" required />
        </Field.Control>
        <Field.Error />
      </Form.Field>
      <Form.Field name="plan">
        <Field.Label>Plan</Field.Label>
        <Select name="plan">
          <Field.Control>
            <Select.Trigger placeholder="Pick a plan" />
          </Field.Control>
          <Select.Content>
            {plans.map((plan) => (
              <Select.Item key={plan.value} value={plan.value}>
                {plan.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <Field.Error />
      </Form.Field>
      <Form.Field name="password">
        <Field.Label>Password</Field.Label>
        <Field.Control>
          <Input type="password" autoComplete="new-password" minLength={8} required />
        </Field.Control>
        <Field.Description>At least 8 characters. A short sentence works well.</Field.Description>
        <Field.Error />
      </Form.Field>
      <Form.Field name="terms" orientation="horizontal" className="flex-wrap">
        <Field.Control>
          <Checkbox value="yes" />
        </Field.Control>
        <Field.Label>I agree to the terms of service</Field.Label>
        <Field.Error className="w-full" />
      </Form.Field>
      <Form.Submit fullWidth>Create account</Form.Submit>
      {account ? (
        <p role="status" className="text-muted-foreground text-sm">
          Welcome aboard, {account.name}. We sent a confirmation to {account.email}.
        </p>
      ) : null}
    </Form>
  );
}
