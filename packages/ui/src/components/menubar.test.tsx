import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Menubar } from './menubar';

vi.mock('motion/react');

interface EditorProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onAction?: (action: string) => void;
  dir?: 'ltr' | 'rtl';
}

function Editor({ onAction = vi.fn(), ...props }: EditorProps) {
  const [ruler, setRuler] = React.useState(false);
  const [zoom, setZoom] = React.useState('100');

  return (
    <Menubar aria-label="Editor" {...props}>
      <Menubar.Menu value="file">
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item shortcut="⌘N" onSelect={() => onAction('new')}>
            New file
          </Menubar.Item>
          <Menubar.Item onSelect={() => onAction('open')}>Open</Menubar.Item>
          <Menubar.Item disabled>Revert</Menubar.Item>
          <Menubar.Item onSelect={() => onAction('print')}>Print</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu value="edit">
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Undo</Menubar.Item>
          <Menubar.Sub>
            <Menubar.SubTrigger>Find</Menubar.SubTrigger>
            <Menubar.SubContent>
              <Menubar.Item onSelect={() => onAction('find')}>Find in file</Menubar.Item>
              <Menubar.Item>Replace</Menubar.Item>
            </Menubar.SubContent>
          </Menubar.Sub>
          <Menubar.Item>Paste</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu value="view">
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.CheckboxItem checked={ruler} onCheckedChange={setRuler}>
            Show ruler
          </Menubar.CheckboxItem>
          <Menubar.Separator />
          <Menubar.Label>Zoom</Menubar.Label>
          <Menubar.RadioGroup value={zoom} onValueChange={setZoom} aria-label="Zoom">
            <Menubar.RadioItem value="100">100%</Menubar.RadioItem>
            <Menubar.RadioItem value="150">150%</Menubar.RadioItem>
          </Menubar.RadioGroup>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
}

const trigger = (name: string) => screen.getByRole('menuitem', { name });

describe('Menubar structure', () => {
  it('renders a menubar with menu triggers and a single tab stop', () => {
    render(<Editor />);
    const bar = screen.getByRole('menubar', { name: 'Editor' });
    expect(bar).toHaveAttribute('data-slot', 'menubar');

    const file = trigger('File');
    expect(file).toHaveAttribute('aria-haspopup', 'menu');
    expect(file).toHaveAttribute('aria-expanded', 'false');
    expect(file).toHaveAttribute('data-state', 'closed');
    expect(file).toHaveAttribute('tabindex', '0');
    expect(trigger('Edit')).toHaveAttribute('tabindex', '-1');
    expect(trigger('View')).toHaveAttribute('tabindex', '-1');
  });

  it('labels the open menu with its trigger and renders shortcuts as text', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    await user.click(trigger('File'));

    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('aria-labelledby', trigger('File').id);
    expect(trigger('File')).toHaveAttribute('aria-expanded', 'true');
    expect(trigger('File')).toHaveAttribute('aria-controls', menu.id);
    expect(trigger('File')).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('⌘N')).toHaveAttribute('data-slot', 'menubar-shortcut');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus());
  });

  it('has no axe violations closed and open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Editor />);
    await expectNoAxeViolations(container);
    await user.click(trigger('View'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    await expectNoAxeViolations(document.body);
  });
});

describe('Menubar open state', () => {
  it('reports the open menu when uncontrolled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Editor onValueChange={onValueChange} />);

    await user.click(trigger('Edit'));
    expect(onValueChange).toHaveBeenLastCalledWith('edit');
    await user.click(trigger('Edit'));
    expect(onValueChange).toHaveBeenLastCalledWith('');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('follows a controlled value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Editor value="view" onValueChange={onValueChange} />);

    expect(screen.getByRole('menu')).toHaveAttribute('aria-labelledby', trigger('View').id);
    await user.click(trigger('View'));
    expect(onValueChange).toHaveBeenCalledWith('');
    expect(screen.getByRole('menu')).toBeInTheDocument();

    rerender(<Editor value="" onValueChange={onValueChange} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Editor />
        <button type="button">Outside</button>
      </>,
    );
    await user.click(trigger('File'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('runs the item action and closes the menu', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Editor onAction={onAction} />);
    await user.click(trigger('File'));
    await user.click(screen.getByRole('menuitem', { name: 'Print' }));

    expect(onAction).toHaveBeenCalledWith('print');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger('File')).toHaveFocus();
  });
});

describe('Menubar keyboard', () => {
  it('opens with ArrowDown and focuses the first item', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('File').focus();
    await user.keyboard('{ArrowDown}');

    expect(trigger('File')).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus());
  });

  it('opens with ArrowUp and focuses the last item', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('File').focus();
    await user.keyboard('{ArrowUp}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Print' })).toHaveFocus());
  });

  it('opens with Enter and Space', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('Edit').focus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.keyboard(' ');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());
  });

  it('moves between triggers with the arrows while closed, with a roving tab stop', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('File').focus();

    await user.keyboard('{ArrowRight}');
    expect(trigger('Edit')).toHaveFocus();
    expect(trigger('Edit')).toHaveAttribute('tabindex', '0');
    expect(trigger('File')).toHaveAttribute('tabindex', '-1');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.keyboard('{End}');
    expect(trigger('View')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(trigger('File')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(trigger('View')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(trigger('File')).toHaveFocus();
  });

  it('stops at the edges when loop is off', async () => {
    const user = userEvent.setup();
    render(
      <Menubar aria-label="Editor" loop={false}>
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>New</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>Undo</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>,
    );
    trigger('File').focus();
    await user.keyboard('{ArrowLeft}');
    expect(trigger('File')).toHaveFocus();
  });

  it('moves to the neighbor menu from inside an open menu', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Editor onValueChange={onValueChange} />);
    trigger('File').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus());

    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith('edit');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());
    expect(trigger('Edit')).toHaveAttribute('tabindex', '0');

    await user.keyboard('{ArrowLeft}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus());

    await user.keyboard('{ArrowLeft}');
    await waitFor(() => expect(screen.getByRole('menuitemcheckbox')).toHaveFocus());
  });

  it('opens the neighbor menu when the bar has an open menu and focus is on a trigger', async () => {
    const user = userEvent.setup();
    render(<Editor defaultValue="file" />);
    trigger('File').focus();
    await user.keyboard('{ArrowRight}');

    expect(trigger('Edit')).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());
  });

  it('moves inside a menu skipping disabled items', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('File').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus());

    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Print' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Print' })).toHaveFocus();
  });

  it('closes on Escape and gives focus back to the trigger', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('Edit').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger('Edit')).toHaveFocus();
    expect(trigger('Edit')).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the open menu on Tab', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Editor onValueChange={onValueChange} />);
    trigger('Edit').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());

    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith('');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('focuses items by typing their label', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('File').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus());

    await user.keyboard('p');
    expect(screen.getByRole('menuitem', { name: 'Print' })).toHaveFocus();
    await new Promise((resolve) => setTimeout(resolve, 600));
    await user.keyboard('op');
    expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
  });
});

describe('Menubar checkable items', () => {
  it('toggles a checkbox item and keeps the menu open', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    await user.click(trigger('View'));
    const ruler = screen.getByRole('menuitemcheckbox', { name: 'Show ruler' });
    expect(ruler).toHaveAttribute('aria-checked', 'false');

    await user.click(ruler);
    expect(ruler).toHaveAttribute('aria-checked', 'true');
    expect(ruler).toHaveAttribute('data-state', 'checked');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('works uncontrolled with defaultChecked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Menubar aria-label="Editor" defaultValue="view">
        <Menubar.Menu value="view">
          <Menubar.Trigger>View</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.CheckboxItem defaultChecked onCheckedChange={onCheckedChange}>
              Word wrap
            </Menubar.CheckboxItem>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>,
    );
    const wrap = screen.getByRole('menuitemcheckbox', { name: 'Word wrap' });
    expect(wrap).toHaveAttribute('aria-checked', 'true');
    await user.click(wrap);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(wrap).toHaveAttribute('aria-checked', 'false');
  });

  it('picks a radio item and closes the menu', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    await user.click(trigger('View'));
    expect(screen.getByRole('group', { name: 'Zoom' })).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: '100%' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await user.click(screen.getByRole('menuitemradio', { name: '150%' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(trigger('View'));
    expect(screen.getByRole('menuitemradio', { name: '150%' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemradio', { name: '100%' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('toggles a checkbox item with Space from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('View').focus();
    await user.keyboard('{ArrowDown}');
    const ruler = screen.getByRole('menuitemcheckbox', { name: 'Show ruler' });
    await waitFor(() => expect(ruler).toHaveFocus());
    await user.keyboard(' ');
    expect(ruler).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Menubar submenus', () => {
  it('opens a submenu with ArrowRight and closes it with ArrowLeft', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('Edit').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());

    await user.keyboard('{ArrowDown}');
    const find = screen.getByRole('menuitem', { name: 'Find' });
    expect(find).toHaveFocus();
    expect(find).toHaveAttribute('aria-haspopup', 'menu');
    expect(find).toHaveAttribute('aria-expanded', 'false');

    await user.keyboard('{ArrowRight}');
    expect(find).toHaveAttribute('aria-expanded', 'true');
    const submenu = screen.getAllByRole('menu')[1];
    expect(submenu).toHaveAttribute('aria-labelledby', find.id);
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Find in file' })).toHaveFocus(),
    );

    await user.keyboard('{ArrowLeft}');
    expect(find).toHaveFocus();
    expect(find).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });

  it('closes only the submenu on Escape', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('Edit').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());
    await user.keyboard('{ArrowDown}{Enter}');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Find in file' })).toHaveFocus(),
    );

    await user.keyboard('{Escape}');
    expect(screen.getByRole('menuitem', { name: 'Find' })).toHaveFocus();
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });

  it('jumps to the next menu with ArrowRight from a submenu item', async () => {
    const user = userEvent.setup();
    render(<Editor />);
    trigger('Edit').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());
    await user.keyboard('{ArrowDown}{ArrowRight}');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Find in file' })).toHaveFocus(),
    );

    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(screen.getByRole('menuitemcheckbox')).toHaveFocus());
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });

  it('closes the whole bar after picking a submenu item', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Editor onAction={onAction} />);
    trigger('Edit').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());
    await user.keyboard('{ArrowDown}{ArrowRight}');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Find in file' })).toHaveFocus(),
    );

    await user.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledWith('find');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger('Edit')).toHaveFocus();
  });

  it('reverses the submenu arrows with dir="rtl"', async () => {
    const user = userEvent.setup();
    render(<Editor dir="rtl" />);
    trigger('Edit').focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());

    await user.keyboard('{ArrowDown}{ArrowLeft}');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Find in file' })).toHaveFocus(),
    );
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('menuitem', { name: 'Find' })).toHaveFocus();
    expect(screen.getAllByRole('menu')).toHaveLength(1);

    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus());
    expect(trigger('File')).toHaveAttribute('aria-expanded', 'true');
  });
});
