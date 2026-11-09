import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { z } from 'zod';
import { Field } from './field';
import { Form, type FormErrorsInput } from './form';
import { Input } from './input';
import { Select } from './select';

const schema = z.object({
  email: z.email('Enter a valid email.'),
  plan: z.enum(['hobby', 'pro'], { message: 'Pick a plan.' }),
});

function Signup({ native = false }: { native?: boolean }) {
  return (
    <Form schema={native ? undefined : schema}>
      <Form.ErrorSummary title="Check these fields" />
      <div style={{ height: 1200 }} />
      <Form.Field name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <Input type="email" required />
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
            <Select.Item value="hobby">Hobby</Select.Item>
            <Select.Item value="pro">Pro</Select.Item>
          </Select.Content>
        </Select>
        <Field.Error />
      </Form.Field>
      <Form.Submit>Create account</Form.Submit>
    </Form>
  );
}

interface State {
  errors: FormErrorsInput | null;
  email: string;
  done: boolean;
}

async function createAccount(_previous: State, formData: FormData): Promise<State> {
  const email = String(formData.get('email'));
  await new Promise((resolve) => setTimeout(resolve, 50));
  if (email === 'ada@northwind.dev') {
    return { errors: { email: 'Email already taken.' }, email, done: false };
  }
  return { errors: null, email: '', done: true };
}

function ServerSignup() {
  const [state, action] = React.useActionState(createAccount, {
    errors: null,
    email: '',
    done: false,
  });
  return (
    <Form action={action} errors={state.errors}>
      <Form.ErrorSummary title="Check these fields" />
      <Form.Field name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <Input type="email" defaultValue={state.email} required />
        </Field.Control>
        <Field.Error />
      </Form.Field>
      <Form.Submit>Create account</Form.Submit>
      {state.done ? <p role="status">Created</p> : null}
    </Form>
  );
}

describe('Form in a real browser', () => {
  it('focuses the first invalid field with the browser message', async () => {
    const screen = await render(<Signup native />);
    const email = screen.getByRole('textbox', { name: 'Email' });
    await userEvent.fill(email, 'ada');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await expect.element(email).toHaveFocus();
    await expect.element(email).toHaveAttribute('aria-invalid', 'true');
    const input = email.element() as HTMLInputElement;
    await expect.element(email).toHaveAccessibleDescription(input.validationMessage);
    expect(input.validationMessage.length).toBeGreaterThan(0);
    const box = input.getBoundingClientRect();
    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.bottom).toBeLessThanOrEqual(window.innerHeight);
  });

  it('moves focus from summary links to the field, including a select trigger', async () => {
    const screen = await render(<Signup />);
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    const summary = screen.getByRole('alert', { name: 'Check these fields' });
    await expect.element(summary).toBeVisible();

    await userEvent.click(summary.getByRole('link', { name: 'Pick a plan.' }));
    await expect.element(screen.getByRole('combobox', { name: 'Plan' })).toHaveFocus();

    summary.element().scrollIntoView();
    await userEvent.click(summary.getByRole('link', { name: /./ }).first());
    await expect.element(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
  });

  it('lets the click that blurs a fixed field land even when its error collapses', async () => {
    const screen = await render(<Signup />);
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    const email = screen.getByRole('textbox', { name: 'Email' });
    await userEvent.fill(email, 'ada@northwind.dev');
    await userEvent.click(screen.getByRole('combobox', { name: 'Plan' }));

    await expect
      .element(screen.getByRole('combobox', { name: 'Plan' }))
      .toHaveAttribute('aria-expanded', 'true');
    await expect.element(email).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('keeps server errors after the action resets the form', async () => {
    const screen = await render(<ServerSignup />);
    const email = screen.getByRole('textbox', { name: 'Email' });
    await userEvent.fill(email, 'ada@northwind.dev');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await expect.element(screen.getByRole('alert', { name: 'Check these fields' })).toBeVisible();
    await expect.element(email).toHaveAttribute('aria-invalid', 'true');
    await expect.element(email).toHaveAccessibleDescription('Email already taken.');
    await expect.element(email).toHaveValue('ada@northwind.dev');
    await expect.element(email).toHaveFocus();

    await userEvent.fill(email, 'lin@northwind.dev');
    await expect.element(email).not.toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    await expect.element(screen.getByRole('status')).toHaveTextContent('Created');
    await expect.element(screen.getByRole('alert')).not.toBeInTheDocument();
  });
});
