import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spacer } from './spacer';

describe('Spacer', () => {
  it('fills the available space without a size', () => {
    const { container } = render(<Spacer />);
    const spacer = container.firstElementChild;
    expect(spacer).toHaveClass('flex-1');
    expect(spacer).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a fixed vertical gap', () => {
    const { container } = render(<Spacer size="4" />);
    expect(container.firstElementChild).toHaveClass('h-4');
  });

  it('renders a fixed horizontal gap', () => {
    const { container } = render(<Spacer axis="horizontal" size="6" />);
    const spacer = container.firstElementChild;
    expect(spacer).toHaveClass('w-6');
    expect(spacer).toHaveAttribute('data-axis', 'horizontal');
  });
});
