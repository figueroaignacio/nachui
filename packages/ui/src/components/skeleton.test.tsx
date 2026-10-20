import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders correctly', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('motion-safe:animate-pulse');
    expect(skeleton).not.toHaveClass('animate-pulse');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-12 w-12 rounded-full" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('h-12');
    expect(skeleton).toHaveClass('w-12');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('passes additional props', () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveAttribute('data-testid', 'skeleton');
  });
});
