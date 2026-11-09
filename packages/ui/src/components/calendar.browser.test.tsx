import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Calendar } from './calendar';

const TODAY = '2026-11-09';

function day(date: string) {
  const button = document.querySelector<HTMLButtonElement>(
    `[data-slot="calendar-day"][data-date="${date}"]:not([data-outside])`,
  );
  if (!button) throw new Error(`No day button for ${date}`);
  return button;
}

describe('Calendar in a real browser', () => {
  it('moves real focus across the grid and into the next month', async () => {
    const screen = await render(
      <div>
        <button type="button">Before</button>
        <Calendar locale="en-US" today={TODAY} defaultValue="2026-11-27" />
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Before' }));
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect
      .element(screen.getByRole('button', { name: 'Friday, November 27, 2026' }))
      .toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect
      .element(screen.getByRole('button', { name: 'Friday, December 4, 2026' }))
      .toHaveFocus();
    await expect.element(screen.getByRole('grid')).toHaveAccessibleName('December 2026');
    await userEvent.keyboard('{PageUp}');
    await expect
      .element(screen.getByRole('button', { name: 'Wednesday, November 4, 2026' }))
      .toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(day('2026-11-04')).toHaveAttribute('data-selected');
  });

  it('keeps the tab stop on one day', async () => {
    const screen = await render(
      <div>
        <Calendar locale="en-US" today={TODAY} />
        <button type="button">After</button>
      </div>,
    );
    day(TODAY).focus();
    await userEvent.tab();
    await expect.element(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('reverses the horizontal arrows in rtl', async () => {
    await render(
      <div dir="rtl">
        <Calendar locale="en-US" today={TODAY} />
      </div>,
    );
    day(TODAY).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(day('2026-11-10'));
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(document.activeElement).toBe(day('2026-11-08'));
  });

  it('honours an explicit dir prop and lays the week out from the right', async () => {
    await render(<Calendar locale="en-US" today={TODAY} dir="rtl" />);
    const sunday = day('2026-11-01').getBoundingClientRect();
    const monday = day('2026-11-02').getBoundingClientRect();
    expect(monday.right).toBeLessThan(sunday.left + 1);
    day(TODAY).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(day('2026-11-10'));
  });

  it('draws a continuous band between the ends of a range', async () => {
    await render(
      <Calendar
        locale="en-US"
        today={TODAY}
        mode="range"
        defaultValue={{ start: '2026-11-10', end: '2026-11-13' }}
      />,
    );
    const middle = day('2026-11-11').closest('td') as HTMLElement;
    const band = getComputedStyle(middle, '::before');
    expect(band.content).not.toBe('none');
    expect(band.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    const startCell = day('2026-11-10').closest('td') as HTMLElement;
    const startBand = getComputedStyle(startCell, '::before');
    expect(Number.parseFloat(startBand.width)).toBeCloseTo(startCell.offsetWidth / 2, 0);
  });
});
