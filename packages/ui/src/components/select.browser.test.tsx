import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Select } from './select';

function Regions({ anchored }: { anchored: 'top' | 'bottom' }) {
  return (
    <div className={anchored === 'bottom' ? 'fixed inset-x-4 bottom-2' : 'fixed inset-x-4 top-2'}>
      <Select defaultValue="eu">
        <Select.Trigger aria-label="Region" />
        <Select.Content>
          <Select.Item value="us">US East</Select.Item>
          <Select.Item value="eu">Europe</Select.Item>
          <Select.Item value="sa">South America</Select.Item>
          <Select.Item value="ap">Asia Pacific</Select.Item>
        </Select.Content>
      </Select>
    </div>
  );
}

async function settle() {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

describe('Select in a real browser', () => {
  it('opens below the trigger when there is room', async () => {
    const screen = await render(<Regions anchored="top" />);
    await userEvent.click(screen.getByRole('combobox'));
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await settle();

    const trigger = screen.getByRole('combobox').element().getBoundingClientRect();
    const list = screen.getByRole('listbox').element().getBoundingClientRect();
    expect(list.top).toBeGreaterThanOrEqual(trigger.bottom);
  });

  it('flips above the trigger near the bottom edge', async () => {
    await page.viewport(800, 360);
    const screen = await render(<Regions anchored="bottom" />);
    await userEvent.click(screen.getByRole('combobox'));
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await settle();

    const trigger = screen.getByRole('combobox').element().getBoundingClientRect();
    const list = screen.getByRole('listbox').element().getBoundingClientRect();
    expect(list.bottom).toBeLessThanOrEqual(trigger.top);
    expect(list.top).toBeGreaterThanOrEqual(0);
    await page.viewport(1024, 768);
  });

  it('focuses the selected option and gives focus back on Escape', async () => {
    const screen = await render(<Regions anchored="top" />);
    const trigger = screen.getByRole('combobox');
    trigger.element().focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('option', { name: 'Europe' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('option', { name: 'South America' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect.element(trigger).toHaveFocus();
  });

  it('moves focus into the list when opened with the keyboard after tabbing in', async () => {
    const screen = await render(
      <div>
        <button type="button">Before</button>
        <Regions anchored="top" />
      </div>,
    );
    screen.getByRole('button', { name: 'Before' }).element().focus();
    await userEvent.tab();
    await expect.element(screen.getByRole('combobox')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('option', { name: 'Europe' })).toHaveFocus();
  });
});
