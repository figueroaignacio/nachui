import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { Tooltip, TooltipProvider } from './tooltip';

vi.mock('motion/react', async () => {
  return {
    motion: {
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
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

describe('Tooltip', () => {
  it('shows and hides tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={100}>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Content>Tooltip Content</Tooltip.Content>
      </TooltipProvider>,
    );

    const trigger = screen.getByText('Hover me');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Simulate hover
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Tooltip Content')).toBeInTheDocument();
    });

    // Simulate unhover
    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
