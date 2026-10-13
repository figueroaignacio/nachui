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
