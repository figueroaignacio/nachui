import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field, useField } from './field';

function BareControl() {
  const props = useField();
  return <input {...props} />;
}

describe('Field', () => {
  it('wires label, description and error to the control', () => {
    render(
      <Field invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
        <Field.Description>We never share it.</Field.Description>
        <Field.Error>Enter a valid address.</Field.Error>
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(screen.getByText('We never share it.').id);
    expect(describedBy).toContain(screen.getByRole('alert').id);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders a list when several errors are given', () => {
    render(
      <Field>
        <Field.Error errors={['Too short', { message: 'No spaces' }, undefined, 'Too short']} />
      </Field>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders nothing when there are no errors', () => {
    render(
      <Field>
        <Field.Error errors={[]} />
      </Field>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('passes disabled down to the control', () => {
    render(
      <Field disabled>
        <Field.Label>Name</Field.Label>
        <BareControl />
      </Field>,
    );
    expect(screen.getByLabelText('Name')).toBeDisabled();
  });

  it('marks orientation on the root', () => {
    const { container } = render(
      <Field orientation="horizontal">
        <Field.Label>Toggle</Field.Label>
      </Field>,
    );
    expect(container.querySelector('[data-slot="field"]')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );
  });

  it('renders a fieldset with a legend', () => {
    render(
      <Field.Set>
        <Field.Legend>Plan</Field.Legend>
      </Field.Set>,
    );
    expect(screen.getByRole('group', { name: 'Plan' })).toBeInTheDocument();
  });
});
