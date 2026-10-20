import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Label } from './label';

describe('Label', () => {
  it('renders correctly', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('passes htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Email</Label>);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('applies custom classes', () => {
    render(<Label className="custom-class">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-class');
  });

  it('renders required indicator', () => {
    render(<Label required>Name</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders optional text', () => {
    render(<Label optional>Bio</Label>);
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Label description="Helper text goes here">Name</Label>);
    expect(screen.getByText('Helper text goes here')).toBeInTheDocument();
  });

  it('renders required and description together', () => {
    render(
      <Label required description="This field is required">
        Email
      </Label>,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('keeps the required asterisk visual only', () => {
    render(
      <>
        <Label htmlFor="name" required>
          Name
        </Label>
        <input id="name" required />
      </>,
    );
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByText('(required)')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeRequired();
  });

  it('gives the description an id the input can point at', async () => {
    const { container } = render(
      <>
        <Label htmlFor="vat" description="Printed on invoices.">
          VAT
        </Label>
        <input id="vat" aria-describedby="vat-label-description" />
      </>,
    );
    expect(screen.getByText('Printed on invoices.')).toHaveAttribute('id', 'vat-label-description');
    expect(screen.getByRole('textbox', { name: 'VAT' })).toHaveAccessibleDescription(
      'Printed on invoices.',
    );
    await expectNoAxeViolations(container);
  });

  it('accepts a custom description id', () => {
    render(
      <Label descriptionId="hint" description="Helper">
        Field
      </Label>,
    );
    expect(screen.getByText('Helper')).toHaveAttribute('id', 'hint');
  });
});
