import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Tabs } from './tabs';

vi.mock('motion/react');

describe('Tabs', () => {
  it('renders default tab and switches content on click', async () => {
    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs>,
    );

    const tab1Trigger = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2Trigger = screen.getByRole('tab', { name: 'Tab 2' });

    // Initially Tab 1 is active
    expect(tab1Trigger).toHaveAttribute('aria-selected', 'true');
    expect(tab2Trigger).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

    // Click Tab 2
    await userEvent.click(tab2Trigger);

    expect(tab1Trigger).toHaveAttribute('aria-selected', 'false');
    expect(tab2Trigger).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});

function Example({ onValueChange }: { onValueChange?: (value: string) => void }) {
  return (
    <Tabs defaultValue="account" onValueChange={onValueChange}>
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Billing
        </Tabs.Trigger>
        <Tabs.Trigger value="team">Team</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Account panel</Tabs.Content>
      <Tabs.Content value="team">Team panel</Tabs.Content>
      <Tabs.Content value="security">Security panel</Tabs.Content>
    </Tabs>
  );
}

describe('Tabs keyboard and focus', () => {
  it('makes only the active tab reachable with Tab, then the panel', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveAttribute('tabindex', '-1');

    await user.tab();
    expect(screen.getByRole('tabpanel', { name: 'Account' })).toHaveFocus();
  });

  it('selects with the arrow keys, wraps around and skips disabled tabs', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.tab();

    await user.keyboard('{ArrowRight}');
    const team = screen.getByRole('tab', { name: 'Team' });
    expect(team).toHaveFocus();
    expect(team).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Team panel');
    expect(onValueChange).toHaveBeenLastCalledWith('team');

    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Security panel');
  });

  it('jumps to the first and last tab with Home and End', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('Tabs accessibility fixes', () => {
  it('keeps the first enabled tab reachable when nothing is selected', async () => {
    const user = userEvent.setup();
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Trigger value="a" disabled>
            A
          </Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
          <Tabs.Trigger value="c">C</Tabs.Trigger>
        </Tabs.List>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'C' })).toHaveAttribute('tabindex', '-1');
    await user.tab();
    expect(screen.getByRole('tab', { name: 'B' })).toHaveFocus();
  });

  it('keeps the list reachable when the value matches no trigger', () => {
    render(
      <Tabs value="missing">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('tabindex', '0');
  });

  it('navigates with arrows when triggers are wrapped', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <span>
            <Tabs.Trigger value="a">A</Tabs.Trigger>
          </span>
          <span>
            <Tabs.Trigger value="b">B</Tabs.Trigger>
          </span>
        </Tabs.List>
      </Tabs>,
    );
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
  });

  it('only handles the arrow keys of its orientation', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <Tabs.List orientation="vertical">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
      </Tabs>,
    );
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'A' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('tab', { name: 'A' })).toHaveFocus();
  });

  it('ignores up and down on a horizontal list', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
  });

  it('builds valid id references from values with spaces', () => {
    render(
      <Tabs defaultValue="my account">
        <Tabs.List>
          <Tabs.Trigger value="my account">My account</Tabs.Trigger>
          <Tabs.Trigger value="my_account">Other</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="my account">Panel</Tabs.Content>
      </Tabs>,
    );
    const trigger = screen.getByRole('tab', { name: 'My account' });
    const other = screen.getByRole('tab', { name: 'Other' });
    expect(trigger.id).not.toMatch(/\s/);
    expect(trigger.id).not.toBe(other.id);
    expect(screen.getByRole('tabpanel', { name: 'My account' })).toHaveAttribute(
      'id',
      trigger.getAttribute('aria-controls'),
    );
  });

  it('only points aria-controls at panels that exist', () => {
    render(<Example />);
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-controls');
    expect(screen.getByRole('tab', { name: 'Team' })).not.toHaveAttribute('aria-controls');
  });

  it('keeps force mounted panels in the DOM, hidden, with their state', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a" forceMount>
          <input aria-label="Name" />
        </Tabs.Content>
        <Tabs.Content value="b" forceMount>
          Panel B
        </Tabs.Content>
      </Tabs>,
    );

    const panelB = screen.getByText('Panel B');
    expect(panelB).not.toBeVisible();
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-controls', panelB.id);

    await user.type(screen.getByLabelText('Name'), 'Ada');
    await user.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByText('Panel B')).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'A' }));
    expect(screen.getByLabelText('Name')).toHaveValue('Ada');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Example />);
    await expectNoAxeViolations(container);
  });
});
