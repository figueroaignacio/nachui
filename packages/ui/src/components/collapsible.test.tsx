import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { Collapsible } from './collapsible';

vi.mock('motion/react', async () => {
  return {
    motion: {
      button: ({
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
      span: ({
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

describe('Collapsible', () => {
  it('renders closed by default', () => {
    render(
      <Collapsible>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content inside</Collapsible.Content>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: /Toggle/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Content inside')).not.toBeInTheDocument();
  });

  it('toggles content on click', async () => {
    render(
      <Collapsible>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content inside</Collapsible.Content>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: /Toggle/i });

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Content inside')).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.queryByText('Content inside')).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('respects defaultOpen prop', () => {
    render(
      <Collapsible defaultOpen>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content inside</Collapsible.Content>
      </Collapsible>,
    );

    expect(screen.getByText('Content inside')).toBeInTheDocument();
  });
});
