import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { NumberField } from './number-field';
import type { NumberFieldProps } from './number-field';

function Quantity(props: Partial<NumberFieldProps>) {
  return (
    <div style={{ width: 160, padding: 24 }}>
      <NumberField aria-label="Quantity" defaultValue={1} min={1} max={99} {...props}>
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField>
    </div>
  );
}

function pointer(type: string, target: EventTarget) {
  target.dispatchEvent(
    new PointerEvent(type, { bubbles: true, cancelable: true, button: 0, pointerId: 1 }),
  );
}

describe('NumberField in a real browser', () => {
  it('keeps focus in the input when the buttons are pressed', async () => {
    const screen = await render(<Quantity />);
    const input = screen.getByRole('spinbutton');
    await userEvent.click(input);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    await expect.element(input).toHaveValue('2');
    await expect.element(input).toHaveFocus();
  });

  it('skips the buttons in the tab order', async () => {
    const screen = await render(
      <div>
        <button type="button">Before</button>
        <Quantity />
        <button type="button">After</button>
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Before' }));
    await userEvent.keyboard('{Tab}');
    await expect.element(screen.getByRole('spinbutton')).toHaveFocus();
    await userEvent.keyboard('{Tab}');
    await expect.element(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('repeats while a button is held and stops at the limit', async () => {
    const screen = await render(<Quantity defaultValue={1} max={6} />);
    const increase = screen.getByRole('button', { name: 'Increase' }).element();
    pointer('pointerdown', increase);
    await expect.element(screen.getByRole('spinbutton'), { timeout: 3000 }).toHaveValue('6');
    pointer('pointerup', window);
    await expect.element(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
  });

  it('stops repeating when the pointer is released', async () => {
    const screen = await render(<Quantity defaultValue={1} />);
    const increase = screen.getByRole('button', { name: 'Increase' }).element();
    pointer('pointerdown', increase);
    pointer('pointerup', window);
    await new Promise((resolve) => setTimeout(resolve, 700));
    await expect.element(screen.getByRole('spinbutton')).toHaveValue('2');
  });

  it('only takes over the wheel when allowed and focused', async () => {
    const screen = await render(<Quantity defaultValue={5} allowWheel />);
    const input = screen.getByRole('spinbutton').element() as HTMLInputElement;

    const idle = new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true });
    input.dispatchEvent(idle);
    expect(idle.defaultPrevented).toBe(false);
    expect(input.value).toBe('5');

    input.focus();
    const active = new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true });
    input.dispatchEvent(active);
    expect(active.defaultPrevented).toBe(true);
    await expect.element(screen.getByRole('spinbutton')).toHaveValue('6');
  });

  it('commits typed text before Enter submits the form', async () => {
    const onSubmit = vi.fn();
    const screen = await render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget).get('quantity'));
        }}
      >
        <Quantity name="quantity" defaultValue={3} />
        <button type="submit">Add to cart</button>
      </form>,
    );
    const input = screen.getByRole('spinbutton');
    await userEvent.fill(input, '12');
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('12');
    await expect.element(input).toHaveValue('12');
  });

  it('draws the focus ring on the group', async () => {
    const screen = await render(<Quantity />);
    const group = screen.container.querySelector('[data-slot="number-field-group"]')!;
    expect(getComputedStyle(group).boxShadow).toBe('none');
    await userEvent.click(screen.getByRole('spinbutton'));
    expect(getComputedStyle(group).boxShadow).not.toBe('none');
  });

  it('lays out the decrement button at the start in rtl', async () => {
    const screen = await render(
      <div dir="rtl">
        <Quantity />
      </div>,
    );
    const decrease = screen.getByRole('button', { name: 'Decrease' }).element();
    const increase = screen.getByRole('button', { name: 'Increase' }).element();
    expect(decrease.getBoundingClientRect().left).toBeGreaterThan(
      increase.getBoundingClientRect().left,
    );
  });
});
