import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Drawer } from './drawer';
import { HoverCard } from './hover-card';

vi.mock('motion/react');

function Card(props: { openDelay?: number; closeDelay?: number }) {
  return (
    <HoverCard {...props}>
      <HoverCard.Trigger asChild>
        <button type="button">@nacho</button>
      </HoverCard.Trigger>
      <HoverCard.Content>Profile card</HoverCard.Content>
    </HoverCard>
  );
}

function tap(element: Element) {
  fireEvent.pointerDown(element, { pointerType: 'touch' });
  fireEvent.pointerUp(element, { pointerType: 'touch' });
  fireEvent.click(element);
}

describe('HoverCard', () => {
  it('stays closed until hovered', () => {
    render(<Card />);
    expect(screen.queryByText('Profile card')).toBeNull();
  });

  it('opens on focus without delay', async () => {
    render(<Card />);
    await act(async () => {
      screen.getByRole('button', { name: '@nacho' }).focus();
    });
    expect(screen.getByText('Profile card')).toBeInTheDocument();
  });

  it('opens after the hover delay', async () => {
    render(<Card openDelay={30} />);
    fireEvent.pointerEnter(screen.getByRole('button', { name: '@nacho' }), {
      pointerType: 'mouse',
    });
    expect(screen.queryByText('Profile card')).toBeNull();
    expect(await screen.findByText('Profile card')).toBeInTheDocument();
  });

  it('renders open when defaultOpen is set', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCard.Trigger>Trigger</HoverCard.Trigger>
        <HoverCard.Content>Open card</HoverCard.Content>
      </HoverCard>,
    );
    expect(screen.getByText('Open card')).toBeInTheDocument();
    expect(screen.getByText('Trigger')).toHaveAttribute('data-state', 'open');
  });

  it('portals the card, flips it below a trigger at the top edge and stays inline in text', () => {
    const { container } = render(
      <p>
        See the{' '}
        <HoverCard defaultOpen>
          <HoverCard.Trigger>release</HoverCard.Trigger>
          <HoverCard.Content side="top" align="start">
            Release notes
          </HoverCard.Content>
        </HoverCard>
      </p>,
    );

    const card = screen.getByText('Release notes');
    expect(container.contains(card)).toBe(false);
    expect(container.querySelector('p div')).toBeNull();
    expect(card).toHaveStyle({ position: 'fixed' });
    expect(card).toHaveAttribute('data-side', 'bottom');
    expect(card).toHaveAttribute('data-align', 'start');
  });

  it('toggles on touch taps and closes on a tap outside', () => {
    render(
      <div>
        <Card />
        <button type="button">Elsewhere</button>
      </div>,
    );
    const trigger = screen.getByRole('button', { name: '@nacho' });

    tap(trigger);
    expect(screen.getByText('Profile card')).toBeInTheDocument();

    tap(trigger);
    expect(screen.queryByText('Profile card')).toBeNull();

    tap(trigger);
    expect(screen.getByText('Profile card')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }), {
      pointerType: 'touch',
    });
    expect(screen.queryByText('Profile card')).toBeNull();
  });

  it('closes on Escape without closing the drawer around it', async () => {
    const user = userEvent.setup();
    render(
      <Drawer defaultOpen>
        <Drawer.Content>
          <Drawer.Title>Team</Drawer.Title>
          <Card />
        </Drawer.Content>
      </Drawer>,
    );

    act(() => screen.getByRole('button', { name: '@nacho' }).focus());
    expect(screen.getByText('Profile card')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Profile card')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Team' })).toBeInTheDocument();
  });

  it('lets keyboard users tab through the card and back out to the page', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <HoverCard>
          <HoverCard.Trigger asChild>
            <button type="button">@nacho</button>
          </HoverCard.Trigger>
          <HoverCard.Content>
            <a href="/u/nacho">Profile</a>
          </HoverCard.Content>
        </HoverCard>
        <button type="button">Next</button>
      </div>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: '@nacho' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: '@nacho' })).toHaveFocus();

    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('has no axe violations when open', async () => {
    render(<Card />);
    await act(async () => {
      screen.getByRole('button', { name: '@nacho' }).focus();
    });
    await expectNoAxeViolations(document.body);
  });
});
