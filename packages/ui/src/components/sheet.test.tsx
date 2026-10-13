import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
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
