import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { Dialog } from './dialog';
import { Sheet } from './sheet';

vi.mock('motion/react');

function Example(props: Partial<React.ComponentProps<typeof Sheet.Content>>) {
  return (
    <Sheet>
      <Sheet.Trigger>Open</Sheet.Trigger>
      <Sheet.Content {...props}>
        <Sheet.Header>
          <Sheet.Title>Filters</Sheet.Title>
          <Sheet.Description>Narrow down the list.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <button type="button">Apply</button>
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close>Done</Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('stays closed until the trigger is pressed', async () => {
    render(<Example />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('labels the dialog with its title and description', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Filters');
    expect(dialog).toHaveAccessibleDescription('Narrow down the list.');
  });

  it('opens on the right at medium size by default', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-side', 'right');
    expect(dialog).toHaveAttribute('data-size', 'md');
  });

  it('closes with Escape', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes from the close button and from Sheet.Close', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('can hide the built in close button', async () => {
    render(<Example showClose={false} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('renders the trigger as its child when asked', () => {
    render(
      <Sheet>
        <Sheet.Trigger asChild>
          <a href="#filters">Filters</a>
        </Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Title>Filters</Sheet.Title>
        </Sheet.Content>
      </Sheet>,
    );
    expect(screen.getByRole('link', { name: 'Filters' })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
  });
});

describe('Sheet keyboard and focus', () => {
  it('moves focus in on open and keeps Tab inside', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    const close = screen.getByRole('button', { name: 'Close' });
    await waitFor(() => expect(close).toHaveFocus());

    await user.tab();
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus();
  });

  it('gives focus back to the trigger when it closes', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus());

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('shares the page scroll lock with a dialog stacked under it', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger>Edit</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Edit row</Dialog.Title>
          <Example />
        </Dialog.Content>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(await screen.findByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Apply' })).toBeVisible());
    expect(document.documentElement.dataset.scrollLocked).toBe('2');

    await user.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Filters' })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('dialog', { name: 'Edit row' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.dataset.scrollLocked).toBeUndefined();
  });
});
