import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import type { PlainDate } from '../lib/date';
import { Calendar, type CalendarProps, type DateRange } from './calendar';

const TODAY = '2026-11-09';

function renderCalendar(props: Partial<CalendarProps> = {}) {
  return render(<Calendar locale="en-US" today={TODAY} {...(props as CalendarProps)} />);
}

function day(date: PlainDate) {
  const button = document.querySelector<HTMLButtonElement>(
    `[data-slot="calendar-day"][data-date="${date}"]:not([data-outside])`,
  );
  if (!button) throw new Error(`No day button for ${date}`);
  return button;
}

function focusedDate() {
  return (document.activeElement as HTMLElement | null)?.dataset.date;
}

describe('Calendar', () => {
  it('lays out a Sunday first month for en-US', () => {
    renderCalendar();
    const grid = screen.getByRole('grid', { name: 'November 2026' });
    const headers = within(grid).getAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('Sun');
    expect(headers[0]).toHaveAttribute('abbr', 'Sunday');
    const firstDay = grid.querySelector('[data-slot="calendar-day"]');
    expect(firstDay).toHaveAttribute('data-date', '2026-11-01');
  });

  it('starts the week on Monday for es-AR and en-GB', () => {
    const { unmount } = render(<Calendar locale="en-GB" today={TODAY} />);
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Mon');
    expect(document.querySelector('[data-slot="calendar-day"]')).toHaveAttribute(
      'data-date',
      '2026-10-26',
    );
    unmount();
    render(<Calendar locale="es-AR" today={TODAY} />);
    expect(screen.getAllByRole('columnheader')[0]).toHaveAttribute('abbr', 'lunes');
    expect(screen.getByRole('grid')).toHaveAccessibleName('noviembre de 2026');
  });

  it('lets weekStartsOn override the locale', () => {
    renderCalendar({ weekStartsOn: 1 });
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Mon');
  });

  it('always renders six weeks', () => {
    renderCalendar({ defaultMonth: '2026-02-01' });
    const grid = screen.getByRole('grid');
    expect(grid.querySelectorAll('tbody tr')).toHaveLength(6);
    expect(within(grid).getAllByRole('gridcell')).toHaveLength(42);
  });

  it('marks today and labels days with the full date', () => {
    renderCalendar();
    const today = day(TODAY);
    expect(today).toHaveAttribute('aria-current', 'date');
    expect(today).toHaveAttribute('data-today');
    expect(today).toHaveAccessibleName('Monday, November 9, 2026');
  });

  it('keeps a single day in the tab order', () => {
    renderCalendar({ defaultValue: '2026-11-20' });
    const tabbable = document.querySelectorAll('[data-slot="calendar-day"][tabindex="0"]');
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveAttribute('data-date', '2026-11-20');
  });

  it('falls back to today and then to the first enabled day', () => {
    const { unmount } = renderCalendar();
    expect(day(TODAY)).toHaveAttribute('tabindex', '0');
    unmount();
    renderCalendar({ defaultMonth: '2026-12-01', isDateDisabled: (date) => date < '2026-12-03' });
    expect(day('2026-12-03')).toHaveAttribute('tabindex', '0');
  });

  it('selects a day on click when uncontrolled', async () => {
    const onValueChange = vi.fn();
    renderCalendar({ onValueChange });
    await userEvent.click(day('2026-11-12'));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-12');
    expect(day('2026-11-12')).toHaveAttribute('data-selected');
    expect(day('2026-11-12').closest('td')).toHaveAttribute('aria-selected', 'true');
  });

  it('only reflects the controlled value', async () => {
    const onValueChange = vi.fn();
    renderCalendar({ value: '2026-11-03', onValueChange });
    await userEvent.click(day('2026-11-12'));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-12');
    expect(day('2026-11-12')).not.toHaveAttribute('data-selected');
    expect(day('2026-11-03')).toHaveAttribute('data-selected');
  });

  it('selects with Enter and Space', async () => {
    const onValueChange = vi.fn();
    renderCalendar({ onValueChange });
    day(TODAY).focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('2026-11-10');
    await userEvent.keyboard('{ArrowRight} ');
    expect(onValueChange).toHaveBeenLastCalledWith('2026-11-11');
  });

  it('moves focus with the arrow keys, Home and End', async () => {
    renderCalendar();
    day(TODAY).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(focusedDate()).toBe('2026-11-10');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(focusedDate()).toBe('2026-11-08');
    await userEvent.keyboard('{ArrowDown}');
    expect(focusedDate()).toBe('2026-11-15');
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(focusedDate()).toBe('2026-11-01');
    await userEvent.keyboard('{End}');
    expect(focusedDate()).toBe('2026-11-07');
    await userEvent.keyboard('{Home}');
    expect(focusedDate()).toBe('2026-11-01');
    const tabbable = document.querySelectorAll('[data-slot="calendar-day"][tabindex="0"]');
    expect(tabbable).toHaveLength(1);
  });

  it('changes the visible month when focus crosses it', async () => {
    renderCalendar();
    day('2026-11-01').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(focusedDate()).toBe('2026-10-31');
    expect(screen.getByRole('grid')).toHaveAccessibleName('October 2026');
  });

  it('jumps a month with PageUp and PageDown and a year with Shift', async () => {
    const onMonthChange = vi.fn();
    renderCalendar({ onMonthChange });
    day(TODAY).focus();
    await userEvent.keyboard('{PageUp}');
    expect(focusedDate()).toBe('2026-10-09');
    expect(onMonthChange).toHaveBeenLastCalledWith('2026-10-01');
    await userEvent.keyboard('{PageDown}{PageDown}');
    expect(focusedDate()).toBe('2026-12-09');
    await userEvent.keyboard('{Shift>}{PageUp}{/Shift}');
    expect(focusedDate()).toBe('2025-12-09');
    expect(screen.getByRole('grid')).toHaveAccessibleName('December 2025');
  });

  it('navigates with the header buttons', async () => {
    renderCalendar({ previousMonthLabel: 'Mes anterior', nextMonthLabel: 'Mes siguiente' });
    await userEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(screen.getByRole('grid')).toHaveAccessibleName('December 2026');
    await userEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    await userEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(screen.getByRole('grid')).toHaveAccessibleName('October 2026');
  });

  it('follows a controlled month', async () => {
    function Controlled() {
      const [month, setMonth] = React.useState<PlainDate>('2026-03-01');
      return <Calendar locale="en-US" today={TODAY} month={month} onMonthChange={setMonth} />;
    }
    render(<Controlled />);
    expect(screen.getByRole('grid')).toHaveAccessibleName('March 2026');
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid')).toHaveAccessibleName('April 2026');
  });

  it('disables days outside min and max and through isDateDisabled', async () => {
    const onValueChange = vi.fn();
    renderCalendar({
      min: '2026-11-05',
      max: '2026-11-25',
      isDateDisabled: (date) => date === '2026-11-12',
      onValueChange,
    });
    expect(day('2026-11-04')).toHaveAttribute('aria-disabled', 'true');
    expect(day('2026-11-04')).toHaveAttribute('data-disabled');
    expect(day('2026-11-26')).toHaveAttribute('aria-disabled', 'true');
    expect(day('2026-11-12').closest('td')).toHaveAttribute('aria-disabled', 'true');
    expect(day('2026-11-13')).not.toHaveAttribute('aria-disabled');
    await userEvent.click(day('2026-11-12'));
    await userEvent.click(day('2026-11-04'));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
  });

  it('keeps keyboard focus inside min and max', async () => {
    renderCalendar({ min: '2026-11-05', max: '2026-11-25' });
    day('2026-11-06').focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(focusedDate()).toBe('2026-11-05');
    await userEvent.keyboard('{PageDown}');
    expect(focusedDate()).toBe('2026-11-25');
  });

  it('focuses disabled days without selecting them', async () => {
    const onValueChange = vi.fn();
    renderCalendar({ isDateDisabled: (date) => date === '2026-11-10', onValueChange });
    day(TODAY).focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(focusedDate()).toBe('2026-11-10');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('picks a range and swaps the ends when the second day is earlier', async () => {
    const onValueChange = vi.fn<(range: DateRange) => void>();
    renderCalendar({ mode: 'range', onValueChange });
    await userEvent.click(day('2026-11-18'));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(day('2026-11-18')).toHaveAttribute('data-range-start');
    await userEvent.click(day('2026-11-10'));
    expect(onValueChange).toHaveBeenCalledWith({ start: '2026-11-10', end: '2026-11-18' });
    expect(day('2026-11-10')).toHaveAttribute('data-range-start');
    expect(day('2026-11-18')).toHaveAttribute('data-range-end');
    expect(day('2026-11-14')).toHaveAttribute('data-range-middle');
    expect(day('2026-11-14').closest('td')).toHaveAttribute('aria-selected', 'true');
    expect(day('2026-11-19').closest('td')).toHaveAttribute('aria-selected', 'false');
  });

  it('previews the range while the end is missing', async () => {
    renderCalendar({ mode: 'range' });
    await userEvent.click(day('2026-11-10'));
    fireEvent.pointerEnter(day('2026-11-13'));
    expect(day('2026-11-12')).toHaveAttribute('data-range-middle');
    expect(day('2026-11-13')).toHaveAttribute('data-range-end');
    day('2026-11-13').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(day('2026-11-14')).toHaveAttribute('data-range-end');
  });

  it('shows a controlled range', () => {
    renderCalendar({ mode: 'range', value: { start: '2026-11-02', end: '2026-11-04' } });
    expect(day('2026-11-02')).toHaveAttribute('data-range-start');
    expect(day('2026-11-03')).toHaveAttribute('data-range-middle');
    expect(day('2026-11-04')).toHaveAttribute('data-range-end');
  });

  it('renders several months side by side and hides outside days', () => {
    renderCalendar({ mode: 'range', numberOfMonths: 2 });
    const grids = screen.getAllByRole('grid');
    expect(grids).toHaveLength(2);
    expect(grids[1]).toHaveAccessibleName('December 2026');
    expect(document.querySelector('[data-outside]')).toBeNull();
    expect(screen.getAllByRole('button', { name: 'Previous month' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Next month' })).toHaveLength(1);
  });

  it('marks outside days and selects them into their month', async () => {
    renderCalendar();
    const outside = document.querySelector<HTMLButtonElement>(
      '[data-date="2026-12-01"][data-outside]',
    );
    expect(outside).toHaveAttribute('tabindex', '-1');
    await userEvent.click(outside as HTMLButtonElement);
    expect(screen.getByRole('grid')).toHaveAccessibleName('December 2026');
    expect(day('2026-12-01')).toHaveAttribute('data-selected');
  });

  it('can hide outside days', () => {
    renderCalendar({ showOutsideDays: false });
    expect(document.querySelector('[data-outside]')).toBeNull();
  });

  it('announces month changes through a live title', () => {
    renderCalendar();
    expect(document.querySelector('[data-slot="calendar-title"]')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it('forwards the ref to the root', () => {
    const ref = React.createRef<HTMLDivElement>();
    act(() => {
      render(<Calendar ref={ref} locale="en-US" today={TODAY} />);
    });
    expect(ref.current).toHaveAttribute('data-slot', 'calendar');
  });

  it('has no axe violations', async () => {
    const { container } = renderCalendar({
      mode: 'range',
      defaultValue: { start: '2026-11-03', end: '2026-11-06' },
      numberOfMonths: 2,
    });
    await expectNoAxeViolations(container);
  });

  it('has no axe violations in single mode with disabled days', async () => {
    const { container } = renderCalendar({ defaultValue: TODAY, min: '2026-11-05' });
    await expectNoAxeViolations(container);
  });
});
