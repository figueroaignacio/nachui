import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from './drawer';

vi.mock('motion/react');

describe('Drawer', () => {
  it('opens and closes appropriately', async () => {
    render(
      <Drawer>
        <Drawer.Trigger>Open Drawer</Drawer.Trigger>
        <Drawer.Content side="right">
          <Drawer.Header>
            <Drawer.Title>Drawer Title</Drawer.Title>
            <Drawer.Description>Drawer Description</Drawer.Description>
          </Drawer.Header>
          <div>Drawer Content Body</div>
          <Drawer.Close>Close Custom</Drawer.Close>
        </Drawer.Content>
      </Drawer>,
    );

    const trigger = screen.getByRole('button', { name: 'Open Drawer' });

    // initially hidden
    expect(screen.queryByText('Drawer Title')).not.toBeInTheDocument();

    // click trigger
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Drawer Title')).toBeInTheDocument();
      expect(screen.getByText('Drawer Description')).toBeInTheDocument();
      expect(screen.getByText('Drawer Content Body')).toBeInTheDocument();
    });

    // click close button (default one with X icon, or our custom one)
    const closeBtn = screen.getByRole('button', { name: 'Close Custom' });
    await userEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Drawer Title')).not.toBeInTheDocument();
    });
  });
});
