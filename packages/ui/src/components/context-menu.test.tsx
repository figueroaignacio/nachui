import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { ContextMenu } from './context-menu';

vi.mock('motion/react');

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
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.contextMenu(trigger, { clientX: 40, clientY: 40 });

    await waitFor(() => {
      expect(trigger).toHaveAttribute('data-state', 'open');
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

    fireEvent.pointerDown(document.body);

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

  it('can be controlled with open and onOpenChange', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <ContextMenu open onOpenChange={onOpenChange}>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    rerender(
      <ContextMenu open={false} onOpenChange={onOpenChange}>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('starts open with defaultOpen', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Area')).toHaveAttribute('data-state', 'open');
  });
});

describe('ContextMenu layering, touch and keyboard', () => {
  it('describes its keyboard shortcut without claiming popup semantics', () => {
    renderMenu();
    const trigger = screen.getByText('Right click here');

    expect(trigger).not.toHaveAttribute('aria-haspopup');
    expect(trigger).not.toHaveAttribute('aria-expanded');
    expect(trigger).toHaveAttribute('aria-keyshortcuts', 'Shift+F10 ContextMenu');
    expect(trigger).toHaveClass('[-webkit-touch-callout:none]');
  });

  it('opens from the ContextMenu key', async () => {
    renderMenu();
    const trigger = screen.getByText('Right click here');
    trigger.focus();

    fireEvent.keyDown(trigger, { key: 'ContextMenu' });

    expect(await screen.findByRole('menu')).toBeInTheDocument();
  });

  it('portals the menu to the body at a fixed viewport position', async () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByText('Area'), { clientX: 30, clientY: 50 });
    const menu = await screen.findByRole('menu');

    expect(container).not.toContainElement(menu);
    expect(menu.style.position).toBe('fixed');
    expect(menu).toHaveClass('z-500', 'max-h-(--available-height)');
  });

  it('focuses items by typing the start of their label', async () => {
    renderMenu();
    fireEvent.contextMenu(screen.getByText('Right click here'), { clientX: 10, clientY: 10 });
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(screen.getByText('Copy')).toHaveFocus());

    fireEvent.keyDown(menu, { key: 'd' });

    expect(screen.getByText('Delete')).toHaveFocus();
  });

  it('marks Escape as handled', async () => {
    renderMenu();
    fireEvent.contextMenu(screen.getByText('Right click here'), { clientX: 10, clientY: 10 });
    const menu = await screen.findByRole('menu');

    expect(fireEvent.keyDown(menu, { key: 'Escape' })).toBe(false);
  });

  it.each([
    ['scroll', () => fireEvent.scroll(window)],
    ['resize', () => fireEvent(window, new Event('resize'))],
    ['blur', () => fireEvent.blur(window)],
  ])('closes on window %s', async (_name, dispatch) => {
    renderMenu();
    fireEvent.contextMenu(screen.getByText('Right click here'), { clientX: 10, clientY: 10 });
    await screen.findByRole('menu');

    act(() => dispatch());

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('focuses the item under the pointer so only one item is highlighted', async () => {
    const user = userEvent.setup();
    renderMenu();
    fireEvent.contextMenu(screen.getByText('Right click here'), { clientX: 10, clientY: 10 });
    await waitFor(() => expect(screen.getByText('Copy')).toHaveFocus());

    await user.hover(screen.getByText('Delete'));

    expect(screen.getByText('Delete')).toHaveFocus();
    expect(screen.getByText('Delete').className).not.toContain('hover:bg-muted');
  });

  it('keeps a long press alive through small finger jitter', () => {
    vi.useFakeTimers();
    try {
      renderMenu();
      const trigger = screen.getByText('Right click here');

      fireEvent.touchStart(trigger, { touches: [{ clientX: 100, clientY: 100 }] });
      fireEvent.touchMove(trigger, { touches: [{ clientX: 103, clientY: 102 }] });
      act(() => vi.advanceTimersByTime(600));

      expect(screen.getByRole('menu')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('cancels a long press when the finger really moves', () => {
    vi.useFakeTimers();
    try {
      renderMenu();
      const trigger = screen.getByText('Right click here');

      fireEvent.touchStart(trigger, { touches: [{ clientX: 100, clientY: 100 }] });
      fireEvent.touchMove(trigger, { touches: [{ clientX: 100, clientY: 130 }] });
      act(() => vi.advanceTimersByTime(600));

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('has no axe violations while open', async () => {
    renderMenu();
    fireEvent.contextMenu(screen.getByText('Right click here'), { clientX: 10, clientY: 10 });
    await screen.findByRole('menu');

    await expectNoAxeViolations(document.body);
  });
});
