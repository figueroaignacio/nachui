import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from './grid';

describe('Grid', () => {
  it('renders children correctly', () => {
    render(<Grid>Test Grid</Grid>);
    expect(screen.getByText('Test Grid')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Grid data-testid="grid">Content</Grid>);
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
  });

  it('applies custom variant classes', () => {
    render(
      <Grid columns="3" rows="2" flow="dense" gap="6" gapX="4" gapY="2" data-testid="grid">
        Content
      </Grid>,
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid-cols-3');
    expect(grid).toHaveClass('grid-rows-2');
    expect(grid).toHaveClass('grid-flow-dense');
    expect(grid).toHaveClass('gap-6');
    expect(grid).toHaveClass('gap-x-4');
    expect(grid).toHaveClass('gap-y-2');
  });
});
