import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsRow } from './settings-row';

const OPTIONS = [
  { value: 'instant', label: 'Instantly' },
  { value: 'daily', label: 'Daily digest' },
];

describe('SettingsRow', () => {
  const writeText = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText } });
    writeText.mockClear();
  });

  it('links the label to the switch and reports toggles', async () => {
    const onCheckedChange = vi.fn();
    render(
      <SettingsRow label="Email alerts" description="One email per event.">
        <SettingsRow.Switch onCheckedChange={onCheckedChange} />
      </SettingsRow>,
    );
    const control = screen.getByLabelText('Email alerts');
    expect(control).toHaveAttribute('role', 'switch');
    expect(control).toHaveAccessibleDescription('One email per event.');
    await userEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('shows the current option and reports a change', async () => {
    const onValueChange = vi.fn();
    render(
      <SettingsRow label="Frequency">
        <SettingsRow.Select options={OPTIONS} value="daily" onValueChange={onValueChange} />
      </SettingsRow>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Frequency' });
    expect(trigger).toHaveTextContent('Daily digest');
    await userEvent.click(trigger);
    fireEvent.click(screen.getByText('Instantly'));
    expect(onValueChange).toHaveBeenCalledWith('instant');
  });

  it('associates the label with the input', () => {
    render(
      <SettingsRow label="Display name">
        <SettingsRow.Input defaultValue="Nacho" />
      </SettingsRow>,
    );
    expect(screen.getByLabelText('Display name')).toHaveValue('Nacho');
  });

  it('disables the control and marks the row', () => {
    const { container } = render(
      <SettingsRow label="Beta features" disabled>
        <SettingsRow.Switch />
      </SettingsRow>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByLabelText('Beta features')).toBeDisabled();
  });

  it('renders a section with its title and a separator between rows', () => {
    const { container } = render(
      <SettingsRow.Section title="Notifications" description="How we reach you.">
        <SettingsRow label="Email">
          <SettingsRow.Switch />
        </SettingsRow>
        <SettingsRow label="Push">
          <SettingsRow.Switch />
        </SettingsRow>
      </SettingsRow.Section>,
    );
    expect(screen.getByRole('heading', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('How we reach you.')).toBeInTheDocument();
    expect(container.querySelectorAll('[role="none"]')).toHaveLength(1);
  });

  it('copies the value from the copy button', async () => {
    const onCopied = vi.fn();
    render(
      <SettingsRow label="API key">
        <SettingsRow.Value value="sk_live_4f2…" copy onCopied={onCopied} />
      </SettingsRow>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('sk_live_4f2…');
    expect(onCopied).toHaveBeenCalledWith('sk_live_4f2…');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});
