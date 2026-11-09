import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { DatePicker } from './date-picker';

const TODAY = '2026-11-09';

async function settle() {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function Picker({ position }: { position: string }) {
  return (
    <div className={`fixed w-64 ${position}`}>
      <DatePicker
        aria-label="Delivery date"
        locale="en-US"
        today={TODAY}
        placeholder="Pick a date"
      />
    </div>
  );
}

describe('DatePicker in a real browser', () => {
  it('focuses today when it opens and returns focus on Escape', async () => {
    const screen = await render(<Picker position="start-4 top-4" />);
    const trigger = screen.getByRole('button', { name: 'Delivery date' });
    await userEvent.click(trigger);
    await expect
      .element(screen.getByRole('button', { name: 'Monday, November 9, 2026' }))
      .toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect
      .element(screen.getByRole('button', { name: 'Wednesday, November 11, 2026' }))
      .toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect.element(trigger).toHaveFocus();
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('picks with the keyboard and shows the date in the trigger', async () => {
    const screen = await render(<Picker position="start-4 top-4" />);
    const trigger = screen.getByRole('button', { name: 'Delivery date' });
    await userEvent.click(trigger);
    await expect
      .element(screen.getByRole('button', { name: 'Monday, November 9, 2026' }))
      .toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect.element(trigger).toHaveFocus();
    await expect.element(trigger).toHaveTextContent('Nov 16, 2026');
  });

  it('keeps the popover inside the viewport near the bottom corner', async () => {
    await page.viewport(800, 600);
    const screen = await render(<Picker position="end-2 bottom-2" />);
    await userEvent.click(screen.getByRole('button', { name: 'Delivery date' }));
    await expect.element(screen.getByRole('dialog')).toBeVisible();
    await settle();
    await new Promise((resolve) => setTimeout(resolve, 400));

    const trigger = screen
      .getByRole('button', { name: 'Delivery date' })
      .element()
      .getBoundingClientRect();
    const dialog = screen.getByRole('dialog').element().getBoundingClientRect();
    expect(dialog.bottom).toBeLessThanOrEqual(trigger.top);
    expect(dialog.top).toBeGreaterThanOrEqual(0);
    expect(dialog.left).toBeGreaterThanOrEqual(0);
    expect(dialog.right).toBeLessThanOrEqual(800);
    await page.viewport(1024, 768);
  });

  it('applies a preset with a click', async () => {
    const screen = await render(
      <div className="fixed start-4 top-4 w-72">
        <DatePicker
          aria-label="Stay"
          mode="range"
          locale="en-US"
          today={TODAY}
          presets={[{ label: 'Next week', value: { start: '2026-11-16', end: '2026-11-22' } }]}
        />
      </div>,
    );
    const trigger = screen.getByRole('button', { name: 'Stay' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Next week' }));
    await expect.element(trigger).toHaveTextContent('Nov 16, 2026 - Nov 22, 2026');
  });
});
