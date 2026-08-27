import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { ContextMenu } from './context-menu';

vi.mock('motion/react', async () => {
  return {
    motion: {
      div: ({
        children,
        style,
        _initial,
        _animate,
        _exit,
        _variants,
        _transition,
        ref,
        ...props
      }: React.ComponentProps<'div'> & Record<string, unknown>) => (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          style={style as React.CSSProperties}
          {...(props as React.ComponentProps<'div'>)}
        >
          {children}
        </div>
      ),
    },
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

function renderMenu(handleAction = vi.fn()) {
  render(
    <ContextMenu>
      <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Label>Actions</ContextMenu.Label>
        <ContextMenu.Separator />
        <ContextMenu.Item onClick={handleAction}>
          Copy
          <ContextMenu.Shortcut>Ctrl C</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item disabled>Paste</ContextMenu.Item>
        <ContextMenu.Item variant="destructive">Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>,
  );
  return { handleAction };
}

describe('ContextMenu', () => {
  it('opens on right click and fires item actions', async () => {
    const { handleAction } = renderMenu();

    const trigger = screen.getByText('Right click here');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.contextMenu(trigger, { clientX: 40, clientY: 40 });

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Copy'));

    await waitFor(() => {
      expect(handleAction).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('closes on Escape', async () => {
    renderMenu();

    fireEvent.contextMenu(screen.getByText('Right click here'), { clientX: 10, clientY: 10 });
    const menu = await screen.findByRole('menu');

    fireEvent.keyDown(menu, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('closes when clicking outside', async () => {
    renderMenu();

    fireEvent.contextMenu(screen.getByText('Right click here'), { clientX: 10, clientY: 10 });
    await screen.findByRole('menu');

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('opens from the keyboard with Shift+F10', async () => {
    renderMenu();

    const trigger = screen.getByText('Right click here');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'F10', shiftKey: true });

    expect(await screen.findByRole('menu')).toBeInTheDocument();
  });

  it('skips disabled items and styles destructive ones', async () => {
    renderMenu();

    fireEvent.contextMenu(screen.getByText('Right click here'), { clientX: 10, clientY: 10 });
    await screen.findByRole('menu');

    expect(screen.getByText('Paste')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Delete')).toHaveClass('text-destructive');
  });

  it('moves focus between items with arrow keys', async () => {
    renderMenu();

    fireEvent.contextMenu(screen.getByText('Right click here'), { clientX: 10, clientY: 10 });
    const menu = await screen.findByRole('menu');

    await waitFor(() => {
      expect(screen.getByText('Copy')).toHaveFocus();
    });

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByText('Delete')).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByText('Copy')).toHaveFocus();
  });
});
