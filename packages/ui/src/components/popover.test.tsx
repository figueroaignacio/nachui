import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Dialog } from './dialog';
import { Popover } from './popover';

vi.mock('motion/react');

function Rename(props: { showClose?: boolean }) {
  return (
    <div>
      <button type="button">Before</button>
      <Popover>
        <Popover.Trigger>Rename</Popover.Trigger>
        <Popover.Content showClose={props.showClose}>
          <input aria-label="Project name" defaultValue="acme-web" />
          <Popover.Close>Cancel</Popover.Close>
        </Popover.Content>
      </Popover>
      <button type="button">After</button>
    </div>
  );
}

describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Content</Popover.Content>
      </Popover>,
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('shows content when trigger is clicked', async () => {
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Popover content</Popover.Content>
      </Popover>,
    );

    await userEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('hides content when trigger is clicked again', async () => {
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Popover content</Popover.Content>
      </Popover>,
    );

    const trigger = screen.getByText('Open');
    await userEvent.click(trigger);
    expect(screen.getByText('Popover content')).toBeInTheDocument();

    await userEvent.click(trigger);
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('renders with defaultOpen', () => {
    render(
      <Popover defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Content</Popover.Content>
      </Popover>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('portals the content to the body with fixed positioning', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ overflow: 'hidden' }}>
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    expect(container.contains(dialog)).toBe(false);
    expect(dialog.parentElement).toBe(document.body);
    expect(dialog).toHaveStyle({ position: 'fixed' });
    expect(dialog).toHaveAttribute('data-side', 'bottom');
  });

  it('names the dialog after its trigger unless a label is given', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Popover>
        <Popover.Trigger>Share</Popover.Trigger>
        <Popover.Content>Content</Popover.Content>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Share' }));
    expect(screen.getByRole('dialog', { name: 'Share' })).toBeInTheDocument();

    rerender(
      <Popover>
        <Popover.Trigger>Share</Popover.Trigger>
        <Popover.Content aria-label="Share settings">Content</Popover.Content>
      </Popover>,
    );
    expect(screen.getByRole('dialog', { name: 'Share settings' })).toBeInTheDocument();
  });

  it('returns focus to the trigger when Popover.Close is clicked', async () => {
    const user = userEvent.setup();
    render(<Rename />);

    const trigger = screen.getByRole('button', { name: 'Rename' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('returns focus to the trigger when the built-in close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Rename showClose />);

    const trigger = screen.getByRole('button', { name: 'Rename' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape, refocuses the trigger and marks the event handled', async () => {
    const user = userEvent.setup();
    const outer = vi.fn();
    render(<Rename />);
    document.addEventListener('keydown', outer);

    const trigger = screen.getByRole('button', { name: 'Rename' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(outer.mock.calls[0]?.[0].defaultPrevented).toBe(true);
    document.removeEventListener('keydown', outer);
  });

  it('closes only itself when Escape is pressed inside a dialog', async () => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Popover>
            <Popover.Trigger>Options</Popover.Trigger>
            <Popover.Content>Popover body</Popover.Content>
          </Popover>
        </Dialog.Content>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByText('Popover body')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
  });

  it('closes on an outside pointer down without moving focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Rename />);

    await user.click(screen.getByRole('button', { name: 'Rename' }));
    await user.click(screen.getByRole('button', { name: 'Before' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
  });

  it('keeps a page-order tab flow around the portaled content', async () => {
    const user = userEvent.setup();
    render(<Rename />);

    const trigger = screen.getByRole('button', { name: 'Rename' });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Project name' })).toHaveFocus();

    await user.tab({ shift: true });
    expect(trigger).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Project name' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('merges its own props into an asChild trigger', async () => {
    const user = userEvent.setup();
    const ref = vi.fn();
    render(
      <Popover>
        <Popover.Trigger asChild aria-label="Project actions" className="outer" disabled>
          <button type="button" className="inner" ref={ref}>
            ...
          </button>
        </Popover.Trigger>
        <Popover.Content>Content</Popover.Content>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Project actions' });
    expect(trigger).toHaveClass('outer', 'inner');
    expect(trigger).toBeDisabled();
    expect(ref).toHaveBeenCalledWith(trigger);
    await user.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const user = userEvent.setup();
    render(<Rename showClose />);
    await user.click(screen.getByRole('button', { name: 'Rename' }));
    await expectNoAxeViolations(document.body);
  });
});
