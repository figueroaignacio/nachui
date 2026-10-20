import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Dialog } from './dialog';

vi.mock('motion/react');

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

    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      expect(screen.getByText('Dialog Description')).toBeInTheDocument();
      expect(screen.getByText('Dialog Content Body')).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    await userEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });
  });
});

function Example(props: React.ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog>
      <Dialog.Trigger>Rename</Dialog.Trigger>
      <Dialog.Content {...props}>
        <Dialog.Title>Rename project</Dialog.Title>
        <input aria-label="Name" />
        <button type="button">Save</button>
      </Dialog.Content>
    </Dialog>
  );
}

describe('Dialog keyboard and focus', () => {
  it('moves focus into the dialog when it opens', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Rename' }));

    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus());
    expect(screen.getByRole('dialog', { name: 'Rename project' })).toHaveAttribute(
      'aria-modal',
      'true',
    );
  });

  it('keeps Tab and Shift+Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Rename' }));
    const name = screen.getByRole('textbox', { name: 'Name' });
    await waitFor(() => expect(name).toHaveFocus());

    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.tab();
    expect(name).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('closes on Escape and gives focus back to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Rename' });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus());

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes only the topmost of two stacked dialogs on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger>Settings</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog>
            <Dialog.Trigger>Delete workspace</Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Are you sure?</Dialog.Title>
              <button type="button">Delete</button>
            </Dialog.Content>
          </Dialog>
        </Dialog.Content>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.click(await screen.findByRole('button', { name: 'Delete workspace' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus());
    expect(document.documentElement.dataset.scrollLocked).toBe('2');

    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Are you sure?' })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.dataset.scrollLocked).toBe('1');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.dataset.scrollLocked).toBeUndefined();
  });

  it('can hide or rename the close button', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Example closeLabel="Cerrar" />);
    await user.click(screen.getByRole('button', { name: 'Rename' }));
    expect(await screen.findByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
    unmount();

    render(<Example showClose={false} />);
    await user.click(screen.getByRole('button', { name: 'Rename' }));
    await screen.findByRole('dialog');
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });
});

describe('Dialog asChild and refs', () => {
  it('forwards ref and extra props through an asChild trigger and close', async () => {
    const user = userEvent.setup();
    const triggerRef = React.createRef<HTMLButtonElement>();
    const childRef = React.createRef<HTMLButtonElement>();
    const closeRef = React.createRef<HTMLButtonElement>();
    const onTriggerKeyDown = vi.fn();
    const onChildClick = vi.fn();

    render(
      <Dialog>
        <Dialog.Trigger
          asChild
          ref={triggerRef}
          className="trigger-class"
          data-testid="trigger"
          onKeyDown={onTriggerKeyDown}
        >
          <button type="button" ref={childRef} className="child-class" onClick={onChildClick}>
            Open
          </button>
        </Dialog.Trigger>
        <Dialog.Content showClose={false}>
          <Dialog.Title>Asked</Dialog.Title>
          <Dialog.Close asChild ref={closeRef} data-testid="close">
            <button type="button">Done</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(triggerRef.current).toBe(trigger);
    expect(childRef.current).toBe(trigger);
    expect(trigger).toHaveClass('trigger-class', 'child-class');
    expect(trigger).toHaveAttribute('data-testid', 'trigger');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');

    trigger.focus();
    await user.keyboard('a');
    expect(onTriggerKeyDown).toHaveBeenCalled();

    await user.click(trigger);
    expect(onChildClick).toHaveBeenCalledTimes(1);
    const done = await screen.findByRole('button', { name: 'Done' });
    expect(closeRef.current).toBe(done);
    expect(done).toHaveAttribute('data-testid', 'close');

    await user.click(done);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps the content ref attached across renders', async () => {
    const user = userEvent.setup();
    const contentRef = vi.fn();

    function Counter() {
      const [count, setCount] = React.useState(0);
      return (
        <Dialog defaultOpen>
          <Dialog.Content ref={contentRef}>
            <Dialog.Title>Count {count}</Dialog.Title>
            <button type="button" onClick={() => setCount((value) => value + 1)}>
              Add
            </button>
          </Dialog.Content>
        </Dialog>
      );
    }

    render(<Counter />);
    const add = await screen.findByRole('button', { name: 'Add' });
    const calls = contentRef.mock.calls.length;
    await user.click(add);
    await user.click(add);

    expect(screen.getByRole('heading', { name: 'Count 2' })).toBeInTheDocument();
    expect(contentRef.mock.calls.length).toBe(calls);
  });

  it('colors the close icon with theme tokens instead of opacity', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Rename' }));
    const close = await screen.findByRole('button', { name: 'Close' });
    expect(close).toHaveClass('text-muted-foreground', 'hover:text-foreground');
    expect(close).not.toHaveClass('opacity-70');
    await expectNoAxeViolations(document.body);
  });
});
