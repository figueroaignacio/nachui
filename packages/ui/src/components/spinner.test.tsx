import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
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

  it('announces "Loading" by default and accepts a translated label', () => {
    const { rerender } = render(<Spinner />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();

    rerender(<Spinner label="Cargando" />);
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
  });

  it('keeps the label as text inside the live region so it gets announced', () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saving');
  });

  it('slows down instead of stopping when motion is reduced', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveClass(
      'animate-spin',
      'motion-reduce:[animation-duration:2.5s]',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spinner />);
    await expectNoAxeViolations(container);
  });
});
