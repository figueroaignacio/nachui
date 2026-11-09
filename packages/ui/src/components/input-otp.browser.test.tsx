import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { InputOTP } from './input-otp';

function slots() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-slot="input-otp-slot"]'));
}

function slotText() {
  return slots().map((slot) => slot.textContent ?? '');
}

function paste(input: HTMLElement, text: string) {
  const data = new DataTransfer();
  data.setData('text/plain', text);
  const event = new ClipboardEvent('paste', {
    clipboardData: data,
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, 'clipboardData', { value: data });
  input.dispatchEvent(event);
}

async function clickSlot(input: HTMLElement, index: number) {
  const slot = slots()[index];
  if (!slot) throw new Error(`No slot ${index}`);
  const box = input.getBoundingClientRect();
  const rect = slot.getBoundingClientRect();
  await userEvent.click(input, {
    position: {
      x: rect.left - box.left + rect.width / 2,
      y: rect.top - box.top + rect.height / 2,
    },
  });
}

describe('InputOTP in a real browser', () => {
  it('fills slots from real typing and skips letters', async () => {
    const screen = await render(<InputOTP aria-label="Code" />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    await userEvent.click(input);
    await userEvent.keyboard('4a8b2');

    await expect.element(input).toHaveValue('482');
    expect(slotText()).toEqual(['4', '8', '2', '', '', '']);
    expect(slots()[3]?.hasAttribute('data-active')).toBe(true);
  });

  it('fills every slot from a pasted code', async () => {
    const onComplete = vi.fn();
    const screen = await render(<InputOTP aria-label="Code" onComplete={onComplete} />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    await userEvent.click(input);

    paste(input.element() as HTMLElement, '482 913');

    await expect.element(input).toHaveValue('482913');
    expect(slotText()).toEqual(['4', '8', '2', '9', '1', '3']);
    expect(onComplete).toHaveBeenCalledWith('482913');
    expect(slots()[5]?.hasAttribute('data-active')).toBe(true);
  });

  it('moves the caret to the clicked slot and replaces that character', async () => {
    const screen = await render(<InputOTP aria-label="Code" defaultValue="123456" />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    const element = input.element() as HTMLInputElement;

    await clickSlot(element, 2);
    await expect.poll(() => slots()[2]?.hasAttribute('data-active')).toBe(true);
    expect(element.selectionStart).toBe(2);
    expect(element.selectionEnd).toBe(3);

    await userEvent.keyboard('9');
    await expect.element(input).toHaveValue('129456');
    await expect.poll(() => slots()[3]?.hasAttribute('data-active')).toBe(true);
  });

  it('clamps a click past the filled slots to the first empty one', async () => {
    const screen = await render(<InputOTP aria-label="Code" defaultValue="12" />);
    const element = screen.getByRole('textbox', { name: 'Code' }).element() as HTMLInputElement;

    await clickSlot(element, 5);

    await expect.poll(() => slots()[2]?.hasAttribute('data-active')).toBe(true);
    expect(element.selectionStart).toBe(2);
  });

  it('deletes backwards from a full code with Backspace', async () => {
    const screen = await render(<InputOTP aria-label="Code" defaultValue="123456" />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    (input.element() as HTMLInputElement).focus();
    await expect.poll(() => slots()[5]?.hasAttribute('data-active')).toBe(true);

    await userEvent.keyboard('{Backspace}{Backspace}');

    await expect.element(input).toHaveValue('1234');
    await expect.poll(() => slots()[4]?.hasAttribute('data-active')).toBe(true);
  });

  it('keeps slots in reading order under an rtl page', async () => {
    const screen = await render(
      <div dir="rtl">
        <InputOTP aria-label="Code" defaultValue="12" length={4} />
      </div>,
    );
    await userEvent.click(screen.getByRole('textbox', { name: 'Code' }));
    const [first, second] = slots().map((slot) => slot.getBoundingClientRect());
    expect(first && second && first.left < second.left).toBe(true);
  });
});
