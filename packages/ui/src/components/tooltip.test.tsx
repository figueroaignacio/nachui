import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip, TooltipProvider } from './tooltip';

vi.mock('motion/react');

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

  it('reports open changes when uncontrolled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip onOpenChange={onOpenChange}>
        <Tooltip.Trigger asChild>
          <button type="button">Save</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Saves the draft</Tooltip.Content>
      </Tooltip>,
    );

    await user.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('starts open with defaultOpen', () => {
    render(
      <Tooltip defaultOpen>
        <Tooltip.Trigger>Info</Tooltip.Trigger>
        <Tooltip.Content>Shown on load</Tooltip.Content>
      </Tooltip>,
    );

    expect(screen.getByRole('tooltip')).toHaveTextContent('Shown on load');
  });

  it('stays closed when controlled closed and asks the parent instead', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip open={false} onOpenChange={onOpenChange}>
        <Tooltip.Trigger asChild>
          <button type="button">Save</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Saves the draft</Tooltip.Content>
      </Tooltip>,
    );

    await user.tab();

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on focus, describes the trigger and closes on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip>
        <Tooltip.Trigger asChild>
          <button type="button">Save</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Saves the draft</Tooltip.Content>
      </Tooltip>,
    );

    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Save' });
    const tooltip = screen.getByRole('tooltip');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('makes a plain-text trigger focusable for keyboard users', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip>
        <Tooltip.Trigger>Info</Tooltip.Trigger>
        <Tooltip.Content>More detail</Tooltip.Content>
      </Tooltip>,
    );

    await user.tab();

    expect(screen.getByText('Info')).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
