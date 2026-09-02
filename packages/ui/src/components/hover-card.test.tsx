import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HoverCard } from './hover-card';

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
});
