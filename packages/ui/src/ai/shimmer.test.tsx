import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Shimmer } from './shimmer';

describe('Shimmer', () => {
  it('renders its text', () => {
    render(<Shimmer>Thinking</Shimmer>);
    expect(screen.getByText('Thinking')).toBeInTheDocument();
  });

  it('renders a paragraph by default', () => {
    render(<Shimmer data-testid="shimmer">Thinking</Shimmer>);
    expect(screen.getByTestId('shimmer').tagName).toBe('P');
  });

  it('renders the element given to as', () => {
    render(
      <Shimmer as="h2" data-testid="shimmer">
        Thinking
      </Shimmer>,
    );
    expect(screen.getByTestId('shimmer').tagName).toBe('H2');
  });

  it('clips the gradient to the text', () => {
    render(<Shimmer data-testid="shimmer">Thinking</Shimmer>);
    expect(screen.getByTestId('shimmer')).toHaveClass('bg-clip-text');
  });
});
