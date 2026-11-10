import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { ModelSelector } from './model-selector';

function Models() {
  return (
    <div className="p-8">
      <ModelSelector defaultValue="opus">
        <ModelSelector.Trigger aria-label="Model" />
        <ModelSelector.Content>
          <ModelSelector.Item value="opus" description="Most capable, slower">
            Opus 5.5
          </ModelSelector.Item>
          <ModelSelector.Item value="sonnet" description="Balanced for everyday work">
            Sonnet 5.5
          </ModelSelector.Item>
        </ModelSelector.Content>
      </ModelSelector>
    </div>
  );
}

describe('ModelSelector in a real browser', () => {
  it('keeps a compact trigger and a list wide enough for descriptions', async () => {
    const screen = await render(<Models />);
    const trigger = screen.getByRole('combobox', { name: 'Model' });
    expect(trigger.element().getBoundingClientRect().width).toBeLessThan(160);
    await userEvent.click(trigger);
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    expect(
      (screen.getByRole('listbox').element() as HTMLElement).offsetWidth,
    ).toBeGreaterThanOrEqual(288);
  });

  it('picks a model with the keyboard', async () => {
    const screen = await render(<Models />);
    const trigger = screen.getByRole('combobox', { name: 'Model' });
    trigger.element().focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('option', { name: /Opus 5.5/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect.element(trigger).toHaveTextContent('Sonnet 5.5');
    await expect.element(trigger).toHaveFocus();
  });
});
