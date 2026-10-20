import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Dialog } from './dialog';
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

    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Tooltip Content')).toBeInTheDocument();
    });

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

  it('portals the content out of clipping ancestors', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ overflow: 'hidden' }}>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <button type="button">Save</button>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">Saves the draft</Tooltip.Content>
        </Tooltip>
      </div>,
    );

    await user.tab();
    const tooltip = screen.getByRole('tooltip');
    expect(container.contains(tooltip)).toBe(false);
    expect(tooltip).toHaveStyle({ position: 'fixed' });
    expect(tooltip).toHaveAttribute('data-side', 'bottom');
  });

  it('renders an inline root that is valid inside a paragraph', () => {
    const { container } = render(
      <p>
        Uses{' '}
        <Tooltip>
          <Tooltip.Trigger>MRR</Tooltip.Trigger>
          <Tooltip.Content>Monthly recurring revenue</Tooltip.Content>
        </Tooltip>
      </p>,
    );

    expect(container.querySelector('p div')).toBeNull();
    expect(screen.getByText('MRR').tagName).toBe('SPAN');
  });

  it('closes on Escape without closing the dialog around it', async () => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Tooltip>
            <Tooltip.Trigger asChild>
              <button type="button">Help</button>
            </Tooltip.Trigger>
            <Tooltip.Content>Opens the help center</Tooltip.Content>
          </Tooltip>
        </Dialog.Content>
      </Dialog>,
    );

    act(() => screen.getByRole('button', { name: 'Help' }).focus());
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
  });

  it('stays open while the pointer moves onto the content', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip delayDuration={0}>
        <Tooltip.Trigger asChild>
          <button type="button">Save</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Saves the draft</Tooltip.Content>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: 'Save' }));
    const tooltip = await screen.findByRole('tooltip');

    await user.hover(tooltip);
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(tooltip);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('opens on a touch long press and closes on the next outside tap', async () => {
    vi.useFakeTimers();
    render(
      <div>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <button type="button">Save</button>
          </Tooltip.Trigger>
          <Tooltip.Content>Saves the draft</Tooltip.Content>
        </Tooltip>
        <button type="button">Elsewhere</button>
      </div>,
    );

    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    fireEvent.pointerUp(trigger, { pointerType: 'touch' });
    act(() => vi.advanceTimersByTime(600));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    act(() => vi.advanceTimersByTime(500));
    fireEvent.pointerUp(trigger, { pointerType: 'touch' });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }), {
      pointerType: 'touch',
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('does not add a second tab stop around a focusable child', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip>
        <Tooltip.Trigger>
          <button type="button">Save</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Saves the draft</Tooltip.Content>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.parentElement).not.toHaveAttribute('tabindex');

    await user.tab();
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);

    await user.tab();
    expect(document.body).toHaveFocus();
    expect(button).not.toHaveAttribute('aria-describedby');
  });

  it('describes the trigger only while open and keeps its own description', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip>
        <Tooltip.Trigger asChild>
          <button type="button" aria-describedby="hint">
            Save
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content>Saves the draft</Tooltip.Content>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Save' });
    expect(trigger).toHaveAttribute('aria-describedby', 'hint');

    await user.tab();
    expect(trigger).toHaveAttribute('aria-describedby', `hint ${screen.getByRole('tooltip').id}`);

    await user.tab();
    expect(trigger).toHaveAttribute('aria-describedby', 'hint');
  });

  it('has no axe violations when open', async () => {
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
    await expectNoAxeViolations(document.body);
  });
});
