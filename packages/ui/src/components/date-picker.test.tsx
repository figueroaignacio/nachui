import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import type { PlainDate } from '../lib/date';
import type { DateRange } from './calendar';
import { DatePicker, type DatePickerProps } from './date-picker';

const TODAY = '2026-11-09';

function renderPicker(props: Partial<DatePickerProps> = {}) {
  return render(
    <>
      <label htmlFor="delivery">Delivery date</label>
      <DatePicker
        id="delivery"
        locale="en-US"
        today={TODAY}
        placeholder="Pick a date"
        {...(props as DatePickerProps)}
      />
    </>,
  );
}

function trigger() {
  return screen.getByRole('button', { name: 'Delivery date' });
}

function day(date: PlainDate) {
  const button = document.querySelector<HTMLButtonElement>(
    `[data-slot="calendar-day"][data-date="${date}"]:not([data-outside])`,
  );
  if (!button) throw new Error(`No day button for ${date}`);
  return button;
}

describe('DatePicker', () => {
  it('shows the placeholder and dialog semantics on the trigger', () => {
    renderPicker();
    expect(trigger()).toHaveTextContent('Pick a date');
    expect(trigger()).toHaveAttribute('data-placeholder', 'true');
    expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('formats the value in the trigger and describes it', () => {
    renderPicker({ defaultValue: '2026-11-12' });
    expect(trigger()).toHaveTextContent('Nov 12, 2026');
    expect(trigger()).toHaveAccessibleDescription('Nov 12, 2026');
  });

  it('opens a dialog and focuses the selected day', async () => {
    renderPicker({ defaultValue: '2026-11-12', dialogLabel: 'Choose a delivery date' });
    await userEvent.click(trigger());
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Choose a delivery date' })).toBeInTheDocument();
    await waitFor(() => expect(day('2026-11-12')).toHaveFocus());
  });

  it('focuses today when there is no value', async () => {
    renderPicker();
    await userEvent.click(trigger());
    await waitFor(() => expect(day(TODAY)).toHaveFocus());
  });

  it('selects a day, closes and gives focus back to the trigger', async () => {
    const onValueChange = vi.fn();
    renderPicker({ onValueChange });
    await userEvent.click(trigger());
    await userEvent.click(day('2026-11-20'));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-20');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
    expect(trigger()).toHaveTextContent('Nov 20, 2026');
  });

  it('stays open after selecting when closeOnSelect is false', async () => {
    renderPicker({ closeOnSelect: false });
    await userEvent.click(trigger());
    await userEvent.click(day('2026-11-20'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on Escape and restores focus', async () => {
    renderPicker();
    await userEvent.click(trigger());
    await waitFor(() => expect(day(TODAY)).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports a controlled open state', async () => {
    const onOpenChange = vi.fn();
    renderPicker({ open: true, onOpenChange });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(day('2026-11-20'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('only reflects a controlled value', async () => {
    const onValueChange = vi.fn();
    renderPicker({ value: '2026-11-03', onValueChange });
    await userEvent.click(trigger());
    await userEvent.click(day('2026-11-20'));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-20');
    expect(trigger()).toHaveTextContent('Nov 3, 2026');
  });

  it('does not open when disabled', async () => {
    renderPicker({ disabled: true });
    expect(trigger()).toBeDisabled();
    await userEvent.click(trigger());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('picks a range over two months and closes on the end', async () => {
    const onValueChange = vi.fn<(range: DateRange | null) => void>();
    renderPicker({ mode: 'range', onValueChange, rangeSeparator: ' to ' });
    await userEvent.click(trigger());
    expect(screen.getAllByRole('grid')).toHaveLength(2);
    await userEvent.click(day('2026-12-04'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(day('2026-11-28'));
    expect(onValueChange).toHaveBeenCalledWith({ start: '2026-11-28', end: '2026-12-04' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger()).toHaveTextContent('Nov 28, 2026 to Dec 4, 2026');
  });

  it('applies presets', async () => {
    const onValueChange = vi.fn();
    const nextWeek = vi.fn(() => ({ start: '2026-11-16', end: '2026-11-22' }));
    renderPicker({
      mode: 'range',
      onValueChange,
      presets: [
        { label: 'This week', value: { start: '2026-11-09', end: '2026-11-15' } },
        { label: 'Next week', value: nextWeek },
      ],
    });
    await userEvent.click(trigger());
    expect(nextWeek).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Next week' }));
    expect(onValueChange).toHaveBeenCalledWith({ start: '2026-11-16', end: '2026-11-22' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger()).toHaveTextContent('Nov 16, 2026 - Nov 22, 2026');
  });

  it('shows today and clear buttons in the footer', async () => {
    const onValueChange = vi.fn();
    renderPicker({
      showFooter: true,
      todayLabel: 'Hoy',
      clearLabel: 'Borrar',
      defaultValue: '2026-11-20',
      closeOnSelect: false,
      onValueChange,
    });
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: 'Borrar' }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(trigger()).toHaveTextContent('Pick a date');
    await userEvent.click(screen.getByRole('button', { name: 'Hoy' }));
    expect(onValueChange).toHaveBeenLastCalledWith(TODAY);
  });

  it('disables the today button when today is not allowed', async () => {
    renderPicker({ showFooter: true, min: '2026-11-10' });
    await userEvent.click(trigger());
    expect(screen.getByRole('button', { name: 'Today' })).toBeDisabled();
  });

  it('submits the value with the form and resets it', async () => {
    let data: FormData | undefined;
    render(
      <form
        aria-label="Order"
        onSubmit={(event) => {
          event.preventDefault();
          data = new FormData(event.currentTarget);
        }}
      >
        <DatePicker
          aria-label="Delivery"
          name="delivery"
          defaultValue="2026-11-12"
          locale="en-US"
        />
        <DatePicker
          aria-label="Stay"
          mode="range"
          name="stay"
          defaultValue={{ start: '2026-12-01', end: '2026-12-05' }}
          locale="en-US"
        />
        <button type="submit">Send</button>
        <button type="reset">Reset</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(data?.get('delivery')).toBe('2026-11-12');
    expect(data?.getAll('stay')).toEqual(['2026-12-01', '2026-12-05']);
  });

  it('restores the default value on form reset', async () => {
    function Form() {
      const [value, setValue] = React.useState<PlainDate | null>(null);
      return (
        <form aria-label="Order">
          <DatePicker
            aria-label="Delivery"
            name="delivery"
            defaultValue="2026-11-12"
            locale="en-US"
            today={TODAY}
            onValueChange={setValue}
          />
          <output>{value ?? 'none'}</output>
          <button type="reset">Reset</button>
        </form>
      );
    }
    render(<Form />);
    const pickerTrigger = screen.getByRole('button', { name: 'Delivery' });
    await userEvent.click(pickerTrigger);
    await userEvent.click(day('2026-11-20'));
    expect(pickerTrigger).toHaveTextContent('Nov 20, 2026');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(pickerTrigger).toHaveTextContent('Nov 12, 2026');
  });

  it('blocks submission while required and empty', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form aria-label="Order" onSubmit={onSubmit}>
        <DatePicker aria-label="Delivery" name="delivery" required locale="en-US" />
        <button type="submit">Send</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('has no axe violations closed or open', async () => {
    const { container } = renderPicker({ defaultValue: '2026-11-12', showFooter: true });
    await expectNoAxeViolations(container);
    await userEvent.click(trigger());
    await expectNoAxeViolations(document.body);
  });
});
