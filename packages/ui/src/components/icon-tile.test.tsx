import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconTile } from './icon-tile';

describe('IconTile', () => {
  it('renders its children', () => {
    render(<IconTile>IF</IconTile>);
    expect(screen.getByText('IF')).toBeInTheDocument();
  });

  it('applies the outline variant and default size by default', () => {
    render(<IconTile data-testid="tile" />);
    const tile = screen.getByTestId('tile');
    expect(tile).toHaveClass('border');
    expect(tile).toHaveClass('size-10');
    expect(tile).toHaveClass('rounded-lg');
  });

  it('applies variant, size and radius classes', () => {
    render(<IconTile data-testid="tile" variant="solid" size="xl" radius="full" />);
    const tile = screen.getByTestId('tile');
    expect(tile).toHaveClass('bg-(--tile-color)');
    expect(tile).toHaveClass('size-14');
    expect(tile).toHaveClass('rounded-full');
  });

  it('sets the tone through CSS variables', () => {
    render(<IconTile data-testid="tile" tone="success" />);
    expect(screen.getByTestId('tile')).toHaveClass('[--tile-color:var(--color-success)]');
  });

  it('uses a tighter radius for the xs size', () => {
    render(<IconTile data-testid="tile" size="xs" />);
    const tile = screen.getByTestId('tile');
    expect(tile).toHaveClass('rounded-md');
    expect(tile).not.toHaveClass('rounded-lg');
  });

  it('merges custom classes', () => {
    render(<IconTile data-testid="tile" className="ring-4" />);
    expect(screen.getByTestId('tile')).toHaveClass('ring-4');
  });
});
