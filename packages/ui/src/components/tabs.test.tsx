import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { Tabs } from './tabs';

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
  };
});

describe('Tabs', () => {
  it('renders default tab and switches content on click', async () => {
    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs>,
    );

    const tab1Trigger = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2Trigger = screen.getByRole('tab', { name: 'Tab 2' });

    // Initially Tab 1 is active
    expect(tab1Trigger).toHaveAttribute('aria-selected', 'true');
    expect(tab2Trigger).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

    // Click Tab 2
    await userEvent.click(tab2Trigger);

    expect(tab1Trigger).toHaveAttribute('aria-selected', 'false');
    expect(tab2Trigger).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});
