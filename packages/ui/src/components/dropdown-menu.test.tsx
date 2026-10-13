import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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

    // Open menu
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('My Account')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    // Click item
    const profileItem = screen.getByText('Profile');
    await userEvent.click(profileItem);

    await waitFor(() => {
      expect(handleAction).toHaveBeenCalledTimes(1);
      // Menu should auto close after action
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
