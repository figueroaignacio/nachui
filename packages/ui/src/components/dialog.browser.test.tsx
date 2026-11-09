import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Dialog } from './dialog';

function Invite() {
  return (
    <div style={{ height: 3000 }}>
      <Dialog>
        <Dialog.Trigger>Invite</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Invite a teammate</Dialog.Title>
          <Dialog.Description>They get an email with a join link.</Dialog.Description>
          <input aria-label="Email" />
          <button type="button">Send</button>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

describe('Dialog in a real browser', () => {
  it('keeps Tab and Shift+Tab inside and returns focus on close', async () => {
    const screen = await render(<Invite />);
    const trigger = screen.getByRole('button', { name: 'Invite' });
    await userEvent.click(trigger);

    const email = screen.getByRole('textbox', { name: 'Email' });
    await expect.element(email).toHaveFocus();
    await userEvent.tab();
    await expect.element(screen.getByRole('button', { name: 'Send' })).toHaveFocus();
    await userEvent.tab();
    await expect.element(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.tab();
    await expect.element(email).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect.element(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
  });

  it('stops the page from scrolling while open and restores it after', async () => {
    const screen = await render(<Invite />);
    await userEvent.click(screen.getByRole('button', { name: 'Invite' }));
    await expect.element(screen.getByRole('dialog')).toBeVisible();

    expect(getComputedStyle(document.body).overflow).toBe('hidden');
    expect(document.documentElement.dataset.scrollLocked).toBe('1');

    await userEvent.keyboard('{Escape}');
    await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
    expect(getComputedStyle(document.body).overflow).not.toBe('hidden');
    expect(document.documentElement.dataset.scrollLocked).toBeUndefined();
  });
});
