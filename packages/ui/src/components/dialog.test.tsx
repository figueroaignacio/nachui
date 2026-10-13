import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
