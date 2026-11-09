import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Tabs } from './tabs';

function Settings({ dir }: { dir: 'ltr' | 'rtl' }) {
  return (
    <div dir={dir}>
      <Tabs defaultValue="account">
        <Tabs.List aria-label="Settings">
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
          <Tabs.Trigger value="team">Team</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account">Account panel</Tabs.Content>
        <Tabs.Content value="billing">Billing panel</Tabs.Content>
        <Tabs.Content value="team">Team panel</Tabs.Content>
      </Tabs>
    </div>
  );
}

describe('Tabs keyboard direction in a real browser', () => {
  it('moves right with ArrowRight in ltr', async () => {
    const screen = await render(<Settings dir="ltr" />);
    await userEvent.click(screen.getByRole('tab', { name: 'Account' }));
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
  });

  it('reverses the arrows in rtl', async () => {
    const screen = await render(<Settings dir="rtl" />);
    await userEvent.click(screen.getByRole('tab', { name: 'Account' }));
    await userEvent.keyboard('{ArrowLeft}');
    await expect.element(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
  });
});
