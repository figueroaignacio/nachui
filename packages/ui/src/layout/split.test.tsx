import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Split } from './split';

describe('Split', () => {
  it('stacks on small screens and splits in half from md', () => {
    render(
      <Split data-testid="split">
        <div>Left</div>
        <div>Right</div>
      </Split>,
    );
    const split = screen.getByTestId('split');
    expect(split).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6');
  });

  it('applies ratio at the chosen breakpoint', () => {
    render(
      <Split ratio="1/3" collapse="lg" gap="4" data-testid="split">
        <div>Left</div>
        <div>Right</div>
      </Split>,
    );
    expect(screen.getByTestId('split')).toHaveClass('lg:grid-cols-[1fr_2fr]', 'gap-4');
  });

  it('never collapses with collapse none', () => {
    render(
      <Split ratio="auto" collapse="none" data-testid="split">
        <div>Left</div>
        <div>Right</div>
      </Split>,
    );
    expect(screen.getByTestId('split')).toHaveClass('grid-cols-[auto_1fr]');
  });

  it('reverses the stacked order', () => {
    render(
      <Split reverse collapse="sm" data-testid="split">
        <div>Left</div>
        <div>Right</div>
      </Split>,
    );
    expect(screen.getByTestId('split')).toHaveClass('[&>*:first-child]:order-last');
  });
});
