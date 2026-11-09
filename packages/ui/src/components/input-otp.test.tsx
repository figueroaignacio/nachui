import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { InputOTP } from './input-otp';

function slots(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('[data-slot="input-otp-slot"]'));
}

function slotText(container: HTMLElement) {
  return slots(container).map((slot) => slot.textContent ?? '');
}

describe('InputOTP', () => {
  it('renders one real input with one-time-code hints and length slots by default', () => {
    const { container } = render(<InputOTP aria-label="Verification code" />);
    const input = screen.getByRole('textbox', { name: 'Verification code' });

    expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('maxlength', '6');
    expect(input).toHaveAttribute('spellcheck', 'false');
    expect(slots(container)).toHaveLength(6);
    expect(container.querySelectorAll('input')).toHaveLength(1);
  });

  it('fills slots as the user types', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <InputOTP aria-label="Code" length={4} onValueChange={onValueChange} />,
    );
    const input = screen.getByRole('textbox', { name: 'Code' });

    await user.click(input);
    await user.keyboard('12');

    expect(input).toHaveValue('12');
    expect(slotText(container)).toEqual(['1', '2', '', '']);
    expect(slots(container)[0]).toHaveAttribute('data-filled');
    expect(slots(container)[2]).not.toHaveAttribute('data-filled');
    expect(slots(container)[2]).toHaveAttribute('data-active');
    expect(onValueChange).toHaveBeenLastCalledWith('12');
  });

  it('ignores characters the pattern does not allow', async () => {
    const user = userEvent.setup();
    render(<InputOTP aria-label="Code" />);
    const input = screen.getByRole('textbox', { name: 'Code' });

    await user.click(input);
    await user.keyboard('1a2-b3');

    expect(input).toHaveValue('123');
  });

  it('accepts letters with the alphanumeric pattern and uses a text keyboard', async () => {
    const user = userEvent.setup();
    render(<InputOTP aria-label="Code" pattern="alphanumeric" length={4} />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    expect(input).toHaveAttribute('inputmode', 'text');

    await user.click(input);
    await user.keyboard('a1-B');

    expect(input).toHaveValue('a1B');
  });

  it('accepts a custom RegExp pattern', async () => {
    const user = userEvent.setup();
    render(<InputOTP aria-label="Code" pattern={/^[A-F]$/} length={4} />);
    const input = screen.getByRole('textbox', { name: 'Code' });

    await user.click(input);
    await user.keyboard('AxB9C');

    expect(input).toHaveValue('ABC');
  });

  it('fills every slot from a pasted code and calls onComplete', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const { container } = render(<InputOTP aria-label="Code" onComplete={onComplete} />);
    const input = screen.getByRole('textbox', { name: 'Code' });

    await user.click(input);
    await user.paste('Your code: 482-913');

    expect(input).toHaveValue('482913');
    expect(slotText(container)).toEqual(['4', '8', '2', '9', '1', '3']);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('482913');
  });

  it('calls onComplete once the last slot is typed', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<InputOTP aria-label="Code" length={4} onComplete={onComplete} />);

    await user.click(screen.getByRole('textbox', { name: 'Code' }));
    await user.keyboard('123');
    expect(onComplete).not.toHaveBeenCalled();
    await user.keyboard('4');

    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('removes the last character with Backspace', async () => {
    const user = userEvent.setup();
    const { container } = render(<InputOTP aria-label="Code" length={4} defaultValue="123" />);
    const input = screen.getByRole('textbox', { name: 'Code' });

    await user.click(input);
    await user.keyboard('{Backspace}');

    expect(input).toHaveValue('12');
    expect(slotText(container)).toEqual(['1', '2', '', '']);
    await user.keyboard('{Backspace}{Backspace}');
    expect(input).toHaveValue('');
  });

  it('moves the active slot with the arrow keys', async () => {
    const user = userEvent.setup();
    const { container } = render(<InputOTP aria-label="Code" length={4} defaultValue="123" />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    act(() => input.focus());

    expect(slots(container)[3]).toHaveAttribute('data-active');
    await user.keyboard('{ArrowLeft}');
    expect(slots(container)[2]).toHaveAttribute('data-active');
    await user.keyboard('{Home}');
    expect(slots(container)[0]).toHaveAttribute('data-active');
    await user.keyboard('9');
    expect(input).toHaveValue('923');
    await user.keyboard('{End}');
    expect(slots(container)[3]).toHaveAttribute('data-active');
  });

  it('only marks a slot active while focused', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <InputOTP aria-label="Code" length={4} />
        <button type="button">Next</button>
      </>,
    );
    expect(container.querySelector('[data-active]')).toBeNull();

    await user.tab();
    expect(slots(container)[0]).toHaveAttribute('data-active');

    await user.tab();
    expect(container.querySelector('[data-active]')).toBeNull();
  });

  it('works controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = React.useState('');
      return (
        <>
          <InputOTP
            aria-label="Code"
            pattern="alphanumeric"
            value={value}
            onValueChange={(next) => setValue(next.toUpperCase())}
          />
          <output data-testid="value">{value}</output>
          <button type="button" onClick={() => setValue('')}>
            Clear
          </button>
        </>
      );
    }
    const { container } = render(<Controlled />);
    const input = screen.getByRole('textbox', { name: 'Code' });

    await user.click(input);
    await user.keyboard('ab1');

    expect(screen.getByTestId('value')).toHaveTextContent('AB1');
    expect(slotText(container).slice(0, 3)).toEqual(['A', 'B', '1']);

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(input).toHaveValue('');
  });

  it('submits its value under name and resets with the form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      return new FormData(event.currentTarget).get('otp');
    });
    render(
      <form onSubmit={onSubmit}>
        <InputOTP aria-label="Code" name="otp" length={4} defaultValue="12" />
        <button type="submit">Verify</button>
        <button type="reset">Reset</button>
      </form>,
    );
    const input = screen.getByRole('textbox', { name: 'Code' });

    await user.click(input);
    await user.keyboard('34');
    await user.click(screen.getByRole('button', { name: 'Verify' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.results[0]?.value).toBe('1234');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(input).toHaveValue('12');
  });

  it('blocks submission when required and empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <InputOTP aria-label="Code" name="otp" required />
        <button type="submit">Verify</button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Code' })).toBeRequired();
  });

  it('blocks submission when required and only partly filled', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <InputOTP aria-label="Code" name="otp" required length={4} defaultValue="12" />
        <button type="submit">Verify</button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('textbox', { name: 'Code' }));
    await user.keyboard('34');
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables the input and marks slots invalid', () => {
    const { container } = render(
      <InputOTP aria-label="Code" disabled aria-invalid id="otp" length={4} />,
    );
    const input = screen.getByRole('textbox', { name: 'Code' });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('id', 'otp');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(container.querySelector('[data-slot="input-otp"]')).toHaveAttribute('data-disabled');
    expect(slots(container)[0]?.className).toContain('border-destructive');
  });

  it('renders custom groups, slots and separators', async () => {
    const { container } = render(
      <div>
        <label htmlFor="code">Code</label>
        <InputOTP id="code" defaultValue="123">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
        </InputOTP>
      </div>,
    );

    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveValue('123');
    expect(container.querySelectorAll('[data-slot="input-otp-group"]')).toHaveLength(2);
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(slots(container).every((slot) => slot.getAttribute('aria-hidden') === 'true')).toBe(
      true,
    );
    await expectNoAxeViolations(container);
  });

  it('keeps the value after an autofill with spaces', () => {
    const onComplete = vi.fn();
    render(<InputOTP aria-label="Code" onComplete={onComplete} />);
    const input = screen.getByRole('textbox', { name: 'Code' });

    fireEvent.change(input, { target: { value: '123 45' } });
    expect(input).toHaveValue('12345');
    fireEvent.change(input, { target: { value: '123456' } });
    expect(onComplete).toHaveBeenCalledWith('123456');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <InputOTP aria-label="Verification code" defaultValue="12" aria-describedby="hint" />,
    );
    await expectNoAxeViolations(container);
  });
});

describe('InputOTP autoFocus', () => {
  it('focuses the input on mount', () => {
    const focusProps = { autoFocus: true };
    render(<InputOTP aria-label="Code" {...focusProps} />);
    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveFocus();
  });
});
