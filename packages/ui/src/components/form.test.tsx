import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Checkbox } from './checkbox';
import { Field } from './field';
import { Form, type FormErrorsInput, type FormProps, useFormField } from './form';
import { Input } from './input';

vi.mock('motion/react');

const schema = z.object({
  name: z.string().min(2, 'Use at least 2 characters.'),
  email: z.email('Enter a valid email.'),
  terms: z.literal('yes', { message: 'Accept the terms to continue.' }),
});

function Signup(props: Partial<FormProps<z.infer<typeof schema>>>) {
  return (
    <Form {...props}>
      <Form.ErrorSummary title="Check these fields" />
      <Form.Field name="name">
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <Input required />
        </Field.Control>
        <Field.Error />
      </Form.Field>
      <Form.Field name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <Input type="email" required />
        </Field.Control>
        <Field.Error />
      </Form.Field>
      <Form.Field name="terms" orientation="horizontal">
        <Field.Control>
          <Checkbox value="yes" />
        </Field.Control>
        <Field.Label>I agree to the terms</Field.Label>
        <Field.Error />
      </Form.Field>
      <Form.Submit>Create account</Form.Submit>
      <button type="reset">Clear</button>
    </Form>
  );
}

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Create account' }));

describe('Form', () => {
  it('renders a form that skips the browser bubbles', () => {
    const { container } = render(<Signup />);
    const form = container.querySelector('form');
    expect(form).toHaveAttribute('novalidate');
    expect(form).toHaveAttribute('data-slot', 'form');
  });

  it('names the controls from Form.Field', () => {
    render(<Signup />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('name', 'email');
    expect(screen.getByRole('checkbox', { name: 'I agree to the terms' })).toHaveAttribute(
      'name',
      'terms',
    );
  });

  it('blocks submit with native constraint errors and marks the fields', async () => {
    const onSubmit = vi.fn();
    render(<Signup onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'not-an-email');
    await submit();

    expect(onSubmit).not.toHaveBeenCalled();
    const name = screen.getByRole('textbox', { name: 'Name' });
    const email = screen.getByRole('textbox', { name: 'Email' });
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid', 'true');
    const errorId = email.getAttribute('aria-describedby');
    expect(errorId).toBeTruthy();
    expect(document.getElementById(errorId as string)).toHaveAttribute('data-slot', 'field-error');
  });

  it('merges schema errors and prefers their messages', async () => {
    render(<Signup schema={schema} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'A');
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@');
    await submit();

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAccessibleDescription(
      'Use at least 2 characters.',
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
      'Enter a valid email.',
    );
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
      'Accept the terms to continue.',
    );
  });

  it('moves focus to the first invalid field', async () => {
    render(<Signup schema={schema} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada Lovelace');
    await submit();
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus());
  });

  it('lists every error in the summary with links that focus the field', async () => {
    render(<Signup schema={schema} />);
    expect(screen.queryByRole('alert', { name: 'Check these fields' })).not.toBeInTheDocument();
    await submit();

    const summary = screen.getByRole('alert', { name: 'Check these fields' });
    const links = Array.from(summary.querySelectorAll('a'));
    expect(links.map((link) => link.textContent)).toEqual([
      'Use at least 2 characters.',
      'Enter a valid email.',
      'Accept the terms to continue.',
    ]);
    const checkbox = screen.getByRole('checkbox');
    expect(links[2]).toHaveAttribute('href', `#${checkbox.id}`);
    await userEvent.click(links[2] as HTMLAnchorElement);
    expect(checkbox).toHaveFocus();
  });

  it('calls onSubmit with the parsed data when everything is valid', async () => {
    const onSubmit = vi.fn();
    render(<Signup schema={schema} onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@northwind.dev');
    await userEvent.click(screen.getByRole('checkbox'));
    await submit();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      name: 'Ada',
      email: 'ada@northwind.dev',
      terms: 'yes',
    });
    expect(onSubmit.mock.calls[0]?.[1].defaultPrevented).toBe(true);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('groups repeated keys into arrays', async () => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <input type="checkbox" name="tags" value="ui" defaultChecked aria-label="UI" />
        <input type="checkbox" name="tags" value="api" defaultChecked aria-label="API" />
        <Form.Submit>Save</Form.Submit>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ tags: ['ui', 'api'] });
  });

  it('shows server errors in the field and the summary', async () => {
    function Server({ errors }: { errors?: FormErrorsInput }) {
      return <Signup errors={errors} />;
    }
    const { rerender } = render(<Server />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    rerender(<Server errors={{ email: ['Email already taken.'] }} />);
    const email = screen.getByRole('textbox', { name: 'Email' });
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Email already taken.');
    expect(screen.getByRole('alert', { name: 'Check these fields' })).toHaveTextContent(
      'Email already taken.',
    );
    await waitFor(() => expect(email).toHaveFocus());

    await userEvent.type(email, 'x');
    expect(email).not.toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('alert', { name: 'Check these fields' })).not.toBeInTheDocument();
  });

  it('revalidates on blur after a failed submit, not on every keystroke', async () => {
    render(<Signup schema={schema} />);
    await submit();
    const name = screen.getByRole('textbox', { name: 'Name' });
    expect(name).toHaveAttribute('aria-invalid', 'true');

    await userEvent.type(name, 'Ada');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    act(() => name.blur());
    expect(name).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('does not validate on blur before the first submit in onSubmit mode', async () => {
    render(<Signup schema={schema} />);
    const name = screen.getByRole('textbox', { name: 'Name' });
    act(() => name.focus());
    act(() => name.blur());
    expect(name).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('validates on blur from the start in onBlur mode', async () => {
    render(<Signup schema={schema} validationMode="onBlur" />);
    const name = screen.getByRole('textbox', { name: 'Name' });
    await userEvent.type(name, 'A');
    expect(name).not.toHaveAttribute('aria-invalid', 'true');
    act(() => name.blur());
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('alert', { name: 'Check these fields' })).not.toBeInTheDocument();
  });

  it('validates on every change in onChange mode', async () => {
    render(<Signup schema={schema} validationMode="onChange" />);
    const name = screen.getByRole('textbox', { name: 'Name' });
    await userEvent.type(name, 'A');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(name, 'd');
    expect(name).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('clears errors when the form resets', async () => {
    render(<Signup schema={schema} />);
    await submit();
    expect(screen.getByRole('alert', { name: 'Check these fields' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('lets a form action run once validation passes', async () => {
    const action = vi.fn();
    render(<Signup schema={schema} action={action} />);
    await submit();
    expect(action).not.toHaveBeenCalled();

    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@northwind.dev');
    await userEvent.click(screen.getByRole('checkbox'));
    await submit();
    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    const formData = action.mock.calls[0]?.[0] as FormData;
    expect(formData.get('email')).toBe('ada@northwind.dev');
  });

  it('marks the submit button busy while an async onSubmit runs', async () => {
    let finish: () => void = () => undefined;
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    render(
      <Form onSubmit={onSubmit}>
        <Form.Submit>Save</Form.Submit>
      </Form>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'true'));
    await act(async () => finish());
    await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'false'));
  });

  it('exposes field errors through useFormField', async () => {
    function Hint() {
      const { invalid, errors } = useFormField('code');
      return <p>{invalid ? errors.join(', ') : 'ok'}</p>;
    }
    render(
      <Form errors={{ code: 'Code expired.' }}>
        <Hint />
      </Form>,
    );
    expect(screen.getByText('Code expired.')).toBeInTheDocument();
  });

  it('has no axe violations with errors showing', async () => {
    const { container } = render(<Signup schema={schema} />);
    await expectNoAxeViolations(container);
    await submit();
    await expectNoAxeViolations(container);
  });
});
