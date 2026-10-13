import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from './container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(<Container>Test Container</Container>);
    expect(screen.getByText('Test Container')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Container data-testid="container">Content</Container>);
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('w-full');
    expect(container).toHaveClass('max-w-screen-xl');
    expect(container).toHaveClass('mx-auto');
  });

  it('applies custom variant classes', () => {
    render(
      <Container size="md" align="left" data-testid="container">
        Content
      </Container>,
    );
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-screen-md');
    expect(container).toHaveClass('mr-auto');
    expect(container).toHaveClass('ml-0');
  });
});
