import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { AlertDialog } from './alert-dialog';

vi.mock('motion/react');

type ExampleProps = {
  onAction?: React.ComponentProps<typeof AlertDialog.Action>['onClick'];
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  rootProps?: Partial<React.ComponentProps<typeof AlertDialog>>;
};

function Example({ onAction, onCancel, rootProps }: ExampleProps) {
  return (
    <AlertDialog {...rootProps}>
      <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete project?</AlertDialog.Title>
          <AlertDialog.Description>
            This removes the project and its deployments for good.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel onClick={onCancel}>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action variant="destructive" onClick={onAction}>
            Delete
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

async function open(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Delete project' }));
  const dialog = await screen.findByRole('alertdialog');
  await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
  return dialog;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AlertDialog', () => {
  it('renders an alertdialog named and described by its title and description', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Delete project' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const dialog = await open(user);

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Delete project?');
    expect(dialog).toHaveAccessibleDescription(
      'This removes the project and its deployments for good.',
    );
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    await expectNoAxeViolations(document.body);
  });

  it('focuses Cancel first, not the destructive action', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await open(user);
    expect(screen.getByRole('button', { name: 'Delete' })).not.toHaveFocus();
  });

  it('keeps Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await open(user);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
  });

  it('does not close when the overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await open(user);

    const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]');
    expect(overlay).not.toBeNull();
    await user.click(overlay as Element);

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('closes on Escape as a Cancel and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(<Example onCancel={onCancel} rootProps={{ onOpenChange }} />);
    await open(user);

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('button', { name: 'Delete project' })).toHaveFocus();
  });

  it('closes after a synchronous action', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Example onAction={onAction} />);
    await open(user);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onAction).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('stays open while an async action is pending and closes when it resolves', async () => {
    const user = userEvent.setup();
    let resolve: () => void = () => {};
    const onAction = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    render(<Example onAction={onAction} />);
    await open(user);

    const action = screen.getByRole('button', { name: 'Delete' });
    await user.click(action);

    expect(action).toHaveAttribute('aria-busy', 'true');
    expect(action).toHaveAttribute('aria-disabled', 'true');
    expect(action.querySelector('svg')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();

    await user.click(action);
    expect(onAction).toHaveBeenCalledTimes(1);

    await user.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await act(async () => resolve());

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('stays open when the async action rejects', async () => {
    const user = userEvent.setup();
    let reject: () => void = () => {};
    render(
      <Example
        onAction={() =>
          new Promise<void>((_, fail) => {
            reject = () => fail(new Error('Network'));
          })
        }
      />,
    );
    await open(user);
    const action = screen.getByRole('button', { name: 'Delete' });
    await user.click(action);

    await act(async () => reject());

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(action).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });

  it('stays open when the action calls preventDefault', async () => {
    const user = userEvent.setup();
    render(<Example onAction={(event) => event.preventDefault()} />);
    await open(user);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('works controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <span data-testid="state">{open ? 'open' : 'closed'}</span>
          <Example rootProps={{ open, onOpenChange: setOpen }} />
        </>
      );
    }
    render(<Controlled />);
    await open(user);
    expect(screen.getByTestId('state')).toHaveTextContent('open');

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(screen.getByTestId('state')).toHaveTextContent('closed');
  });

  it('starts open with defaultOpen', async () => {
    render(<Example rootProps={{ defaultOpen: true }} />);
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
  });

  it('renders custom elements with asChild', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <AlertDialog>
        <AlertDialog.Trigger asChild>
          <a href="#remove">Remove member</a>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Remove Ana?</AlertDialog.Title>
          <AlertDialog.Description>She loses access right away.</AlertDialog.Description>
          <AlertDialog.Footer>
            <AlertDialog.Cancel asChild>
              <button type="button">Keep</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button type="button" onClick={onAction}>
                Remove
              </button>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>,
    );

    await user.click(screen.getByRole('link', { name: 'Remove member' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Keep' })).toHaveFocus());
    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onAction).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('reports a missing title or description', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <AlertDialog defaultOpen>
        <AlertDialog.Content>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog>,
    );
    await waitFor(() => expect(error).toHaveBeenCalledTimes(2));
    expect(String(error.mock.calls[0]?.[0])).toContain('AlertDialog.Title');
    expect(String(error.mock.calls[1]?.[0])).toContain('AlertDialog.Description');
  });
});
