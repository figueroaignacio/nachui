import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { DropdownMenu } from './dropdown-menu';

vi.mock('motion/react');

describe('DropdownMenu', () => {
  it('opens and closes appropriately', async () => {
    const handleAction = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>My Account</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={handleAction}>Profile</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Settings</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole('button', { name: /Open Menu/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    expect(screen.queryByText('My Account')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('My Account')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    const profileItem = screen.getByText('Profile');
    await userEvent.click(profileItem);

    await waitFor(() => {
      expect(handleAction).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('My Account')).not.toBeInTheDocument();
    });
  });
});

function Menu({ onSelect = vi.fn() }: { onSelect?: (item: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => onSelect('edit')}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Move</DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => onSelect('duplicate')}>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => onSelect('delete')}>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

describe('DropdownMenu keyboard and focus', () => {
  it('opens from the trigger with ArrowDown and focuses the first item', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    const trigger = screen.getByRole('button', { name: 'Actions' });

    trigger.focus();
    await user.keyboard('{ArrowDown}');

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toHaveAttribute('aria-labelledby', trigger.id);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
  });

  it('moves with the arrow keys, Home and End, skipping disabled items', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const edit = screen.getByRole('menuitem', { name: 'Edit' });
    await waitFor(() => expect(edit).toHaveFocus());

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(edit).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(edit).toHaveFocus();
  });

  it('activates the focused item with Enter and closes', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Menu onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());

    await user.keyboard('{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledWith('duplicate');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('DropdownMenu reworked behavior', () => {
  it('opens from the trigger with ArrowUp and focuses the last item', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    const trigger = screen.getByRole('button', { name: 'Actions' });

    trigger.focus();
    await user.keyboard('{ArrowUp}');

    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus());
  });

  it('lets Enter follow a link rendered with asChild', async () => {
    const user = userEvent.setup();
    const onLinkClick = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Links</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item asChild>
            <a href="#docs" onClick={onLinkClick}>
              Docs
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole('button', { name: 'Links' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Docs' })).toHaveFocus());
    await user.keyboard('{Enter}');

    expect(onLinkClick).toHaveBeenCalledTimes(1);
    expect(window.location.hash).toBe('#docs');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('focuses items by typing the start of their label', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());

    await user.keyboard('de');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('cycles through items that share a first letter', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());

    await user.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await user.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('portals the menu to the body and caps its height to the viewport', async () => {
    const user = userEvent.setup();
    const { container } = render(<Menu />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    const menu = screen.getByRole('menu');
    expect(container).not.toContainElement(menu);
    expect(menu).toHaveClass('max-h-(--available-height)', 'overflow-y-auto', 'z-500');
    expect(menu.style.position).toBe('fixed');
  });

  it('marks Escape as handled so outer layers stay open', async () => {
    const user = userEvent.setup();
    const prevented: boolean[] = [];
    const recordKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') prevented.push(event.defaultPrevented);
    };
    document.addEventListener('keydown', recordKey);
    render(<Menu />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());

    await user.keyboard('{Escape}');
    document.removeEventListener('keydown', recordKey);

    expect(prevented).toEqual([true]);
  });

  it('focuses the item under the pointer', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());

    await user.hover(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
  });

  it('has no axe violations while open', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await expectNoAxeViolations(document.body);
  });
});

function Columns() {
  const [visible, setVisible] = React.useState({ name: true, email: false });
  const [density, setDensity] = React.useState('comfortable');
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>View</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.CheckboxItem
          checked={visible.name}
          onCheckedChange={(checked) => setVisible((previous) => ({ ...previous, name: checked }))}
        >
          Name
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem
          checked={visible.email}
          onCheckedChange={(checked) => setVisible((previous) => ({ ...previous, email: checked }))}
        >
          Email
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        {['comfortable', 'compact'].map((option) => (
          <DropdownMenu.RadioItem
            key={option}
            checked={density === option}
            onCheckedChange={() => setDensity(option)}
          >
            {option}
          </DropdownMenu.RadioItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

describe('DropdownMenu checkable items', () => {
  it('toggles checkbox items and keeps the menu open', async () => {
    const user = userEvent.setup();
    render(<Columns />);

    await user.click(screen.getByRole('button', { name: 'View' }));
    const email = await screen.findByRole('menuitemcheckbox', { name: 'Email' });
    expect(email).toHaveAttribute('aria-checked', 'false');

    await user.click(email);

    expect(screen.getByRole('menuitemcheckbox', { name: 'Email' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('selects a radio item with the keyboard and closes the menu', async () => {
    const user = userEvent.setup();
    render(<Columns />);

    screen.getByRole('button', { name: 'View' }).focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('menuitemcheckbox', { name: 'Name' })).toHaveFocus(),
    );
    await user.keyboard('{End}{Enter}');

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'View' }));
    expect(await screen.findByRole('menuitemradio', { name: 'compact' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('includes checkable items in arrow navigation', async () => {
    const user = userEvent.setup();
    render(<Columns />);

    screen.getByRole('button', { name: 'View' }).focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('menuitemcheckbox', { name: 'Name' })).toHaveFocus(),
    );
    await user.keyboard('{End}');

    expect(screen.getByRole('menuitemradio', { name: 'compact' })).toHaveFocus();
  });

  it('has no axe violations with checkable items', async () => {
    const user = userEvent.setup();
    render(<Columns />);
    await user.click(screen.getByRole('button', { name: 'View' }));
    await expectNoAxeViolations(await screen.findByRole('menu'));
  });
});
