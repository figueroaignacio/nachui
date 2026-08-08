import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-live', 'polite');
  });

  it('applies size variants correctly', () => {
    const { rerender } = render(<Spinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('w-4', 'h-4');

    rerender(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('w-8', 'h-8');

    rerender(<Spinner size="xl" />);
    expect(screen.getByRole('status')).toHaveClass('w-12', 'h-12');
  });

  it('applies variant colors correctly', () => {
    const { rerender } = render(<Spinner variant="muted" />);
    expect(screen.getByRole('status')).toHaveClass('text-muted-foreground');

    rerender(<Spinner variant="destructive" />);
    expect(screen.getByRole('status')).toHaveClass('text-destructive-text');

    rerender(<Spinner variant="muted" />);
    expect(screen.getByRole('status')).toHaveClass('text-muted-foreground');
  });

  it('merges custom className', () => {
    render(<Spinner className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<Spinner data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
