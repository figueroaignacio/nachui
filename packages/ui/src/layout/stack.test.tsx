import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from './stack';

describe('Stack', () => {
  it('renders children correctly', () => {
    render(<Stack>Test Stack</Stack>);
    expect(screen.getByText('Test Stack')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Stack data-testid="stack">Content</Stack>);
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveClass('flex');
    expect(stack).toHaveClass('flex-col');
  });

  it('allows overriding direction to row', () => {
    render(
      <Stack direction="row" data-testid="stack">
        Content
      </Stack>,
    );
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveClass('flex-row');
  });

  it('forwards the element type to Flex', () => {
    render(
      <Stack as="a" href="/docs" data-testid="stack">
        Docs
      </Stack>,
    );
    expect(screen.getByTestId('stack')).toHaveAttribute('href', '/docs');
  });
});
