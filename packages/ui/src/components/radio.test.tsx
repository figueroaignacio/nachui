import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Radio } from './radio';

describe('Radio', () => {
  it('renders correctly', () => {
    render(<Radio data-testid="radio" />);
    expect(screen.getByTestId('radio')).toBeInTheDocument();
  });

  it('can be checked', () => {
    render(
      <>
        <Radio data-testid="radio-1" name="group" />
        <Radio data-testid="radio-2" name="group" />
      </>,
    );
    const radio1 = screen.getByTestId('radio-1') as HTMLInputElement;
    const radio2 = screen.getByTestId('radio-2') as HTMLInputElement;

    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(false);

    fireEvent.click(radio1);
    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);

    fireEvent.click(radio2);
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(true);
  });

  it('calls onCheckedChange when clicked', () => {
    const onCheckedChange = vi.fn();
    render(<Radio data-testid="radio" onCheckedChange={onCheckedChange} />);
    const radio = screen.getByTestId('radio');

    fireEvent.click(radio);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects disabled state', () => {
    render(<Radio data-testid="radio" disabled />);
    const radio = screen.getByTestId('radio');
    expect(radio).toBeDisabled();
  });

  it('keeps className on the wrapper and puts inputClassName on the input', () => {
    const { container } = render(
      <Radio data-testid="radio" className="mt-1" inputClassName="size-5" />,
    );
    expect(container.firstChild).toHaveClass('mt-1');
    expect(screen.getByTestId('radio')).toHaveClass('size-5');
    expect(screen.getByTestId('radio')).not.toHaveClass('size-4');
  });

  it('checks the input from the enlarged hit area', () => {
    const onCheckedChange = vi.fn();
    const { container } = render(<Radio aria-label="Yearly" onCheckedChange={onCheckedChange} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(screen.getByRole('radio', { name: 'Yearly' })).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(container.firstChild).toHaveClass('pointer-coarse:before:-inset-3.5');
  });

  it('draws the checked dot with a system color in forced colors mode', () => {
    const { container } = render(<Radio aria-label="Yearly" defaultChecked />);
    expect(container.querySelector('[data-slot="radio-indicator"]')).toHaveClass(
      'forced-colors:bg-[Highlight]',
      'forced-colors:forced-color-adjust-none',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <label>
        <Radio name="plan" value="monthly" />
        Monthly
      </label>,
    );
    await expectNoAxeViolations(container);
  });
});
