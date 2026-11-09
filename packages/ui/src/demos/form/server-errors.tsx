'use client';

import * as React from 'react';
import { Field } from '../../components/field';
import { Form, type FormErrorsInput } from '../../components/form';
import { Input } from '../../components/input';

interface InviteState {
  errors: FormErrorsInput | null;
  email: string;
  message: string | null;
}

const TAKEN = ['ada@northwind.dev', 'grace@northwind.dev'];

async function createAccount(_previous: InviteState, formData: FormData): Promise<InviteState> {
  const email = String(formData.get('email') ?? '').toLowerCase();
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (TAKEN.includes(email)) {
    return { errors: { email: 'Email already taken.' }, email, message: null };
  }
  return { errors: null, email: '', message: `Account created for ${email}.` };
}

const initialState: InviteState = { errors: null, email: '', message: null };

export function ServerErrors() {
  const [state, formAction] = React.useActionState(createAccount, initialState);

  return (
    <Form
      action={formAction}
      errors={state.errors}
      className="border-border bg-card w-full max-w-sm gap-5 rounded-xl border p-6"
    >
      <Form.ErrorSummary title="We could not create your account" />
      <Form.Field name="email">
        <Field.Label>Work email</Field.Label>
        <Field.Control>
          <Input type="email" autoComplete="email" defaultValue={state.email} required />
        </Field.Control>
        <Field.Description>
          Try ada@northwind.dev to see the error from the server.
        </Field.Description>
        <Field.Error />
      </Form.Field>
      <Form.Submit fullWidth>Create account</Form.Submit>
      {state.message ? (
        <p role="status" className="text-muted-foreground text-sm">
          {state.message}
        </p>
      ) : null}
    </Form>
  );
}
