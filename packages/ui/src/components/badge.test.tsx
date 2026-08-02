import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    render(<Badge data-testid="badge">Default</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-primary');
  });

  it('applies secondary variant classes', () => {
    render(
      <Badge variant="secondary" data-testid="badge">
        Secondary
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-secondary');
  });

  it('applies destructive variant classes', () => {
    render(
      <Badge variant="destructive" data-testid="badge">
        Destructive
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-destructive/10');
  });

  it('applies outline variant classes', () => {
    render(
      <Badge variant="outline" data-testid="badge">
        Outline
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('text-foreground');
  });
});
