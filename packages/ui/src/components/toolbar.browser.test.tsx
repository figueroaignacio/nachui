import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Select } from './select';
import { ToggleGroup } from './toggle-group';
import { Toolbar } from './toolbar';

function Editor({ dir }: { dir?: 'ltr' | 'rtl' }) {
  return (
    <div dir={dir}>
      <button type="button">Before</button>
      <Toolbar aria-label="Formatting">
        <ToggleGroup type="multiple" aria-label="Text style">
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        </ToggleGroup>
        <Toolbar.Separator />
        <Select defaultValue="sans">
          <Toolbar.Item asChild>
            <Select.Trigger aria-label="Font" className="w-28" />
          </Toolbar.Item>
          <Select.Content>
            <Select.Item value="sans">Sans</Select.Item>
            <Select.Item value="serif">Serif</Select.Item>
          </Select.Content>
        </Select>
        <Toolbar.Button>Share</Toolbar.Button>
      </Toolbar>
      <button type="button">After</button>
    </div>
  );
}

describe('Toolbar in a real browser', () => {
  it('moves through every control and returns to the last one used', async () => {
    const screen = await render(<Editor />);
    await userEvent.click(screen.getByRole('button', { name: 'Before' }));
    await userEvent.tab();
    await expect.element(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect.element(screen.getByRole('combobox', { name: 'Font' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(screen.getByRole('button', { name: 'Share' })).toHaveFocus();

    await userEvent.tab();
    await expect.element(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect.element(screen.getByRole('button', { name: 'Share' })).toHaveFocus();
  });

  it('leaves ArrowDown to the select so it can open', async () => {
    const screen = await render(<Editor />);
    const font = screen.getByRole('combobox', { name: 'Font' });
    (font.element() as HTMLElement).focus();
    await userEvent.keyboard('{ArrowRight}{ArrowLeft}');
    await expect.element(font).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(font).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await expect.element(font).toHaveAttribute('aria-expanded', 'false');
    await expect.element(font).toHaveFocus();
  });

  it('reverses the arrows when an ancestor is rtl', async () => {
    const screen = await render(<Editor dir="rtl" />);
    await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
    await userEvent.keyboard('{ArrowLeft}');
    await expect.element(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
  });

  it('stretches the separator to the height of the controls', async () => {
    const screen = await render(<Editor />);
    const separator = screen.getByRole('separator').element().getBoundingClientRect();
    const share = screen.getByRole('button', { name: 'Share' }).element().getBoundingClientRect();
    expect(separator.width).toBe(1);
    expect(separator.height).toBeGreaterThan(share.height / 2);
    expect(share.height).toBe(32);
  });
});
