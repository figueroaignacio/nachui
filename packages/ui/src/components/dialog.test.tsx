import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { Dialog } from './dialog';

// Mock motion to disable AnimatePresence delay for Portals
vi.mock('motion/react', async () => {
  return {
    motion: {
      div: ({
        children,
        style: _style,
        initial: _initial,
        animate: _animate,
        exit: _exit,
        variants: _variants,
        transition: _transition,
        drag: _drag,
        dragConstraints: _dragConstraints,
        dragElastic: _dragElastic,
        onDragEnd: _onDragEnd,
        whileTap: _whileTap,
        whileHover: _whileHover,
        layoutId: _layoutId,
        ref,
        ...props
      }: React.ComponentProps<'div'> & Record<string, unknown>) => (
        <div ref={ref as React.Ref<HTMLDivElement>} {...(props as React.ComponentProps<'div'>)}>
          {children}
        </div>
      ),
    },
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

describe('Dialog', () => {
  it('opens and closes appropriately', async () => {
    render(
      <Dialog>
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Description>Dialog Description</Dialog.Description>
          </Dialog.Header>
          <div>Dialog Content Body</div>
        </Dialog.Content>
      </Dialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Open Dialog' });

    // initially hidden
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();

    // click trigger
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      expect(screen.getByText('Dialog Description')).toBeInTheDocument();
      expect(screen.getByText('Dialog Content Body')).toBeInTheDocument();
    });

    // click close icon (rendered implicitly by Content)
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    await userEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });
  });
});
