import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { ToggleGroup } from './toggle-group';

function View({ dir, variant }: { dir?: 'ltr' | 'rtl'; variant?: 'default' | 'outline' }) {
  return (
    <div dir={dir}>
      <button type="button">Before</button>
      <ToggleGroup type="single" aria-label="Calendar view" defaultValue="week" variant={variant}>
        <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
        <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
        <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
}

describe('ToggleGroup in a real browser', () => {
  it('tabs into the pressed item and moves focus with the arrows', async () => {
    const screen = await render(<View />);
    await userEvent.click(screen.getByRole('button', { name: 'Before' }));
    await userEvent.tab();
    await expect.element(screen.getByRole('button', { name: 'Week' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(screen.getByRole('button', { name: 'Month' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect
      .element(screen.getByRole('button', { name: 'Month' }))
      .toHaveAttribute('aria-pressed', 'true');
  });

  it('reverses the arrows when an ancestor is rtl', async () => {
    const screen = await render(<View dir="rtl" />);
    await userEvent.click(screen.getByRole('button', { name: 'Week' }));
    await userEvent.keyboard('{ArrowLeft}');
    await expect.element(screen.getByRole('button', { name: 'Month' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(screen.getByRole('button', { name: 'Week' })).toHaveFocus();
  });

  it('lays rtl items out from the right', async () => {
    const screen = await render(<View dir="rtl" />);
    const day = screen.getByRole('button', { name: 'Day' }).element().getBoundingClientRect();
    const month = screen.getByRole('button', { name: 'Month' }).element().getBoundingClientRect();
    expect(day.left).toBeGreaterThan(month.left);
  });

  it('joins outline items edge to edge', async () => {
    const screen = await render(<View variant="outline" />);
    const day = screen.getByRole('button', { name: 'Day' }).element().getBoundingClientRect();
    const week = screen.getByRole('button', { name: 'Week' }).element().getBoundingClientRect();
    expect(week.left).toBe(day.right);
    expect(week.height).toBe(36);
  });
});
