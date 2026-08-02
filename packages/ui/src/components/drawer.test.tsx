import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { Drawer } from './drawer';

// Mock motion to disable AnimatePresence delay for Portals
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
    },
    useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
    useTransform: () => ({ set: vi.fn(), get: () => 0 }),
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

describe('Drawer', () => {
  it('opens and closes appropriately', async () => {
    render(
      <Drawer>
        <Drawer.Trigger>Open Drawer</Drawer.Trigger>
        <Drawer.Content side="right">
          <Drawer.Header>
            <Drawer.Title>Drawer Title</Drawer.Title>
            <Drawer.Description>Drawer Description</Drawer.Description>
          </Drawer.Header>
          <div>Drawer Content Body</div>
          <Drawer.Close>Close Custom</Drawer.Close>
        </Drawer.Content>
      </Drawer>,
    );

    const trigger = screen.getByRole('button', { name: 'Open Drawer' });

    // initially hidden
    expect(screen.queryByText('Drawer Title')).not.toBeInTheDocument();

    // click trigger
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Drawer Title')).toBeInTheDocument();
      expect(screen.getByText('Drawer Description')).toBeInTheDocument();
      expect(screen.getByText('Drawer Content Body')).toBeInTheDocument();
    });

    // click close button (default one with X icon, or our custom one)
    const closeBtn = screen.getByRole('button', { name: 'Close Custom' });
    await userEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Drawer Title')).not.toBeInTheDocument();
    });
  });
});
