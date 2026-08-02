import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { DropdownMenu } from './dropdown-menu';

vi.mock('motion/react', async () => {
  return {
    motion: {
      button: ({
        children,
        _style,
        _initial,
        _animate,
        _exit,
        _variants,
        _transition,
        _drag,
        _dragConstraints,
        _dragElastic,
        _onDragEnd,
        _whileTap,
        _whileHover,
        _layoutId,
        ref,
        ...props
      }: React.ComponentProps<'button'> & Record<string, unknown>) => (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          {...(props as React.ComponentProps<'button'>)}
        >
          {children}
        </button>
      ),
      div: ({
        children,
        _style,
        _initial,
        _animate,
        _exit,
        _variants,
        _transition,
        _drag,
        _dragConstraints,
        _dragElastic,
        _onDragEnd,
        _whileTap,
        _whileHover,
        _layoutId,
        ref,
        ...props
      }: React.ComponentProps<'div'> & Record<string, unknown>) => (
        <div ref={ref as React.Ref<HTMLDivElement>} {...(props as React.ComponentProps<'div'>)}>
          {children}
        </div>
      ),
      span: ({
        children,
        _style,
        _initial,
        _animate,
        _exit,
        _variants,
        _transition,
        _drag,
        _dragConstraints,
        _dragElastic,
        _onDragEnd,
        _whileTap,
        _whileHover,
        _layoutId,
        ref,
        ...props
      }: React.ComponentProps<'span'> & Record<string, unknown>) => (
        <span ref={ref as React.Ref<HTMLSpanElement>} {...(props as React.ComponentProps<'span'>)}>
          {children}
        </span>
      ),
    },
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

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
