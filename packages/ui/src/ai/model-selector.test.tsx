import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { ModelSelector } from './model-selector';

function Models(props: { onValueChange?: (value: string) => void }) {
  return (
    <ModelSelector defaultValue="opus" {...props}>
      <ModelSelector.Trigger aria-label="Model" />
      <ModelSelector.Content>
        <ModelSelector.Item value="opus" description="Most capable" badge="New">
          Opus 5.5
        </ModelSelector.Item>
        <ModelSelector.Item value="haiku" description="Fastest">
          Haiku 5.5
        </ModelSelector.Item>
      </ModelSelector.Content>
    </ModelSelector>
  );
}

describe('ModelSelector', () => {
  it('shows only the model name in the trigger and passes axe', async () => {
    const { container } = render(<Models />);
    const trigger = screen.getByRole('combobox', { name: 'Model' });
    expect(trigger).toHaveTextContent('Opus 5.5');
    expect(trigger).not.toHaveTextContent('Most capable');
    expect(trigger).toHaveAttribute('data-slot', 'model-selector-trigger');
    await expectNoAxeViolations(container);
  });

  it('lists each model with its description and picks one', async () => {
    const onValueChange = vi.fn();
    render(<Models onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Model' }));
    expect(await screen.findByText('Fastest')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    await userEvent.click(await screen.findByRole('option', { name: /Haiku 5.5/, hidden: true }));
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('haiku'));
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Model' })).toHaveTextContent('Haiku 5.5'),
    );
  });
});
