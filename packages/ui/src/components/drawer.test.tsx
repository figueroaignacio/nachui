import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
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

function Example(props: Partial<React.ComponentProps<typeof Drawer.Content>>) {
  return (
    <Drawer>
      <Drawer.Trigger>Share</Drawer.Trigger>
      <Drawer.Content {...props}>
        <Drawer.Title>Share link</Drawer.Title>
        <input aria-label="Email" />
        <button type="button">Send</button>
      </Drawer.Content>
    </Drawer>
  );
}

describe('Drawer keyboard and focus', () => {
  it('focuses the first control, traps Tab and locks page scroll', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Share' }));
    const close = await screen.findByRole('button', { name: 'Close' });
    await waitFor(() => expect(close).toHaveFocus());
    expect(document.body.style.overflow).toBe('hidden');

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Send' })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Send' })).toHaveFocus();
  });

  it('closes on Escape, restores focus and releases the scroll lock', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Share' });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus());

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('can hide or rename the close button', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Example closeLabel="Cerrar" />);
    await user.click(screen.getByRole('button', { name: 'Share' }));
    expect(await screen.findByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
    unmount();

    render(<Example showClose={false} />);
    await user.click(screen.getByRole('button', { name: 'Share' }));
    await screen.findByRole('dialog');
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus());
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });
});
