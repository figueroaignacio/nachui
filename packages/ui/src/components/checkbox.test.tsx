import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '../../test-utils/axe';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox data-testid="checkbox" />);
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  it('can be checked and unchecked', () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it('calls onCheckedChange when clicked', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox data-testid="checkbox" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByTestId('checkbox');

    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects disabled state', () => {
    render(<Checkbox data-testid="checkbox" disabled />);
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('drives both icons from the native state so a click on an indeterminate box updates them', () => {
    const { container } = render(<Checkbox aria-label="Select all" indeterminate />);
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    const [minus, check] = Array.from(container.querySelectorAll('svg'));

    expect(checkbox.indeterminate).toBe(true);
    expect(minus).toHaveClass('opacity-0', 'peer-indeterminate:opacity-100');
    expect(check).toHaveClass('peer-checked:opacity-100', 'peer-indeterminate:opacity-0');

    fireEvent.click(checkbox);
    expect(checkbox.indeterminate).toBe(false);
    expect(checkbox.checked).toBe(true);
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('syncs the native indeterminate flag when the prop changes', () => {
    const { rerender } = render(<Checkbox aria-label="Select all" />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(false);
    rerender(<Checkbox aria-label="Select all" indeterminate />);
    expect(checkbox.indeterminate).toBe(true);
    rerender(<Checkbox aria-label="Select all" indeterminate={false} />);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Checkbox aria-label="Accept terms" indeterminate />);
    await expectNoAxeViolations(container);
  });
});
