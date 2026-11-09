import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Label } from './label';
import { NumberField } from './number-field';
import type { NumberFieldProps } from './number-field';

function Quantity(props: Partial<NumberFieldProps>) {
  return (
    <>
      <Label htmlFor="quantity">Quantity</Label>
      <NumberField id="quantity" defaultValue={1} min={1} max={99} {...props}>
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField>
    </>
  );
}

describe('NumberField', () => {
  it('renders a labelled spinbutton with value attributes', () => {
    render(<Quantity />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('aria-valuenow', '1');
    expect(input).toHaveAttribute('aria-valuemin', '1');
    expect(input).toHaveAttribute('aria-valuemax', '99');
    expect(input).toHaveAttribute('aria-valuetext', '1');
    expect(input).toHaveValue('1');
  });

  it('uses a decimal keyboard when the step has decimals', () => {
    render(<Quantity step={0.5} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('inputmode', 'decimal');
  });

  it('steps with the buttons and disables them at the limits', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Quantity defaultValue={98} onValueChange={onValueChange} />);
    const increase = screen.getByRole('button', { name: 'Increase' });
    const decrease = screen.getByRole('button', { name: 'Decrease' });
    expect(increase).toHaveAttribute('tabindex', '-1');
    expect(increase).toHaveAttribute('aria-controls', 'quantity');

    await user.click(increase);
    expect(onValueChange).toHaveBeenLastCalledWith(99);
    expect(screen.getByRole('spinbutton')).toHaveValue('99');
    expect(increase).toBeDisabled();
    expect(decrease).toBeEnabled();

    await user.click(decrease);
    expect(screen.getByRole('spinbutton')).toHaveValue('98');
    expect(increase).toBeEnabled();
  });

  it('steps once on a keyboard or assistive technology click', () => {
    render(<Quantity />);
    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByRole('spinbutton')).toHaveValue('2');
  });

  it('handles arrows, Shift, PageUp/PageDown, Home and End', async () => {
    const user = userEvent.setup();
    render(<Quantity defaultValue={5} />);
    const input = screen.getByRole('spinbutton');
    await user.click(input);

    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('6');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(input).toHaveValue('4');
    await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
    expect(input).toHaveValue('14');
    await user.keyboard('{PageDown}');
    expect(input).toHaveValue('4');
    await user.keyboard('{PageUp}');
    expect(input).toHaveValue('14');
    await user.keyboard('{End}');
    expect(input).toHaveValue('99');
    await user.keyboard('{Home}');
    expect(input).toHaveValue('1');
  });

  it('leaves Home and End to the caret when there is no bound', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberField aria-label="Offset" defaultValue={3} onValueChange={onValueChange}>
        <NumberField.Input />
      </NumberField>,
    );
    await user.click(screen.getByRole('spinbutton'));
    await user.keyboard('{Home}{End}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps raw text while typing and commits on blur with clamp and step', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Quantity step={5} min={0} max={50} defaultValue={10} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');

    await user.clear(input);
    await user.type(input, '23');
    expect(input).toHaveValue('23');
    expect(onValueChange).not.toHaveBeenCalled();

    await user.tab();
    expect(input).toHaveValue('25');
    expect(onValueChange).toHaveBeenLastCalledWith(25);

    await user.clear(input);
    await user.type(input, '400{Enter}');
    expect(input).toHaveValue('50');
  });

  it('reverts unparseable text and clears to null on empty', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Quantity defaultValue={7} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');

    await user.clear(input);
    await user.type(input, 'abc{Enter}');
    expect(input).toHaveValue('7');
    expect(onValueChange).not.toHaveBeenCalled();

    await user.clear(input);
    await user.tab();
    expect(input).toHaveValue('');
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(input).not.toHaveAttribute('aria-valuenow');
  });

  it('formats with Intl and parses the locale decimal separator', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberField
        aria-label="Price"
        locale="de-DE"
        defaultValue={1234.5}
        step={0.01}
        format={{ style: 'currency', currency: 'EUR' }}
        onValueChange={onValueChange}
      >
        <NumberField.Input />
      </NumberField>,
    );
    const input = screen.getByRole('spinbutton');
    expect((input as HTMLInputElement).value.replace(/\s/g, ' ')).toBe('1.234,50 €');

    await user.clear(input);
    await user.type(input, '2.000,75{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(2000.75);
    expect(input).toHaveAttribute('aria-valuetext', (input as HTMLInputElement).value);
  });

  it('treats typed percents as hundredths', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberField
        aria-label="Discount"
        defaultValue={0.1}
        step={0.01}
        format={{ style: 'percent' }}
        onValueChange={onValueChange}
      >
        <NumberField.Input />
      </NumberField>,
    );
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue('10%');
    await user.clear(input);
    await user.type(input, '25{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(0.25);
    expect(input).toHaveValue('25%');
    await user.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith(0.26);
  });

  it('follows the controlled value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Quantity value={4} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');

    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).toHaveBeenCalledWith(5);
    expect(input).toHaveValue('4');

    rerender(<Quantity value={42} onValueChange={onValueChange} />);
    expect(input).toHaveValue('42');
  });

  it('only steps on wheel when allowed and focused', () => {
    const { rerender } = render(<Quantity defaultValue={5} />);
    const input = screen.getByRole('spinbutton');
    input.focus();
    fireEvent.wheel(input, { deltaY: -100 });
    expect(input).toHaveValue('5');

    rerender(<Quantity defaultValue={5} allowWheel />);
    input.blur();
    fireEvent.wheel(input, { deltaY: -100 });
    expect(input).toHaveValue('5');

    input.focus();
    fireEvent.wheel(input, { deltaY: -100 });
    expect(input).toHaveValue('6');
    fireEvent.wheel(input, { deltaY: 100 });
    expect(input).toHaveValue('5');
  });

  it('blocks changes when disabled or read only', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender, container } = render(<Quantity disabled onValueChange={onValueChange} />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    expect(container.querySelector('[data-slot="number-field-group"]')).toHaveAttribute(
      'data-disabled',
    );

    rerender(<Quantity readOnly onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('readonly');
    await user.click(input);
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('submits the raw number and resets with the form', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Quantity name="quantity" defaultValue={3} required />
      </form>,
    );
    const form = container.querySelector('form')!;
    expect(new FormData(form).get('quantity')).toBe('3');
    expect(screen.getByRole('spinbutton')).toBeRequired();

    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(new FormData(form).get('quantity')).toBe('4');

    fireEvent.reset(form);
    expect(screen.getByRole('spinbutton')).toHaveValue('3');
  });

  it('forwards aria-invalid and lets the buttons be renamed', () => {
    render(
      <NumberField aria-label="Seats" aria-invalid defaultValue={2}>
        <NumberField.Group>
          <NumberField.Decrement aria-label="Remove a seat" />
          <NumberField.Input />
          <NumberField.Increment aria-label="Add a seat" />
        </NumberField.Group>
      </NumberField>,
    );
    expect(screen.getByRole('spinbutton', { name: 'Seats' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Add a seat' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove a seat' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Quantity name="quantity" />
        <NumberField aria-label="Budget" format={{ style: 'currency', currency: 'USD' }} disabled>
          <NumberField.Group>
            <NumberField.Decrement />
            <NumberField.Input />
            <NumberField.Increment />
          </NumberField.Group>
        </NumberField>
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});
