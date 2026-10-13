import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
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
