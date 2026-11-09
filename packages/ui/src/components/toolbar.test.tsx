import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Select } from './select';
import { ToggleGroup } from './toggle-group';
import { Toolbar } from './toolbar';

vi.mock('motion/react');

function Editor({
  onShare,
  orientation,
  dir,
}: {
  onShare?: () => void;
  orientation?: 'horizontal' | 'vertical';
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <>
      <button type="button">Before</button>
      <Toolbar aria-label="Formatting" orientation={orientation} dir={dir}>
        <ToggleGroup type="multiple" aria-label="Text style" defaultValue={['bold']}>
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        </ToggleGroup>
        <Toolbar.Separator />
        <Toolbar.Toggle aria-label="Strikethrough">S</Toolbar.Toggle>
        <Toolbar.Button disabled>Undo</Toolbar.Button>
        <Toolbar.Link href="#help">Help</Toolbar.Link>
        <Toolbar.Button onClick={onShare}>Share</Toolbar.Button>
      </Toolbar>
      <button type="button">After</button>
    </>
  );
}

const button = (name: string) => screen.getByRole('button', { name });

describe('Toolbar', () => {
  it('renders a labelled toolbar with an opposite separator', () => {
    render(<Editor />);
    const toolbar = screen.getByRole('toolbar', { name: 'Formatting' });
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
    expect(toolbar).toHaveAttribute('data-slot', 'toolbar');
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('gives the whole toolbar, nested group included, a single tab stop', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    const tabbable = ['Bold', 'Italic', 'Strikethrough', 'Share'].filter(
      (name) => button(name).getAttribute('tabindex') === '0',
    );
    expect(tabbable).toEqual(['Bold']);
    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('tabindex', '-1');

    await user.click(button('Before'));
    await user.tab();
    expect(button('Bold')).toHaveFocus();
    await user.tab();
    expect(button('After')).toHaveFocus();
  });

  it('walks every control with the arrows and skips disabled ones', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    await user.click(button('Before'));
    await user.tab();

    await user.keyboard('{ArrowRight}');
    expect(button('Italic')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(button('Strikethrough')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('link', { name: 'Help' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(button('Share')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(button('Bold')).toHaveFocus();
    await user.keyboard('{End}');
    expect(button('Share')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(button('Bold')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(button('Share')).toHaveFocus();
  });

  it('remembers the last control when focus comes back', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    await user.click(button('Before'));
    await user.tab();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(button('Strikethrough')).toHaveFocus();

    await user.tab();
    expect(button('After')).toHaveFocus();
    await user.tab({ shift: true });
    expect(button('Strikethrough')).toHaveFocus();
  });

  it('activates controls with Space and Enter', async () => {
    const user = userEvent.setup();
    const onShare = vi.fn();
    render(<Editor onShare={onShare} />);
    await user.click(button('Before'));
    await user.tab();

    await user.keyboard('{ArrowRight}');
    await user.keyboard(' ');
    expect(button('Italic')).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard('{ArrowRight}{Enter}');
    expect(button('Strikethrough')).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard('{End}{Enter}');
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it('uses up and down when vertical', async () => {
    const user = userEvent.setup();
    render(<Editor orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    await user.click(button('Before'));
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(button('Bold')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(button('Italic')).toHaveFocus();
  });

  it('reverses horizontal arrows with dir="rtl"', async () => {
    const user = userEvent.setup();
    render(<Editor dir="rtl" />);
    await user.click(button('Before'));
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(button('Italic')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(button('Bold')).toHaveFocus();
  });

  it('registers arbitrary controls through Item asChild', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar aria-label="Document">
        <Toolbar.Button>Undo</Toolbar.Button>
        <Select defaultValue="sans">
          <Toolbar.Item asChild>
            <Select.Trigger aria-label="Font" className="w-28" />
          </Toolbar.Item>
          <Select.Content>
            <Select.Item value="sans">Sans</Select.Item>
            <Select.Item value="serif">Serif</Select.Item>
          </Select.Content>
        </Select>
        <Toolbar.Item>Redo</Toolbar.Item>
      </Toolbar>,
    );
    const font = screen.getByRole('combobox', { name: 'Font' });
    expect(font).toHaveAttribute('tabindex', '-1');
    expect(font).toHaveClass('w-28');

    await user.tab();
    expect(button('Undo')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(font).toHaveFocus();
    expect(font).toHaveAttribute('tabindex', '0');
    await user.keyboard('{ArrowRight}');
    expect(button('Redo')).toHaveFocus();
    expect(button('Redo')).toHaveAttribute('data-slot', 'toolbar-item');
  });

  it('leaves the arrow keys alone inside a text field', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar aria-label="Search">
        <Toolbar.Item asChild>
          <input aria-label="Query" defaultValue="toolbar" />
        </Toolbar.Item>
        <Toolbar.Button>Go</Toolbar.Button>
      </Toolbar>,
    );
    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Query' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('textbox', { name: 'Query' })).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Editor />);
    await expectNoAxeViolations(container);
  });
});
