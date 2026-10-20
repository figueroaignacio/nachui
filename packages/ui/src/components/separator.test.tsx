import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders horizontal separator by default', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('role', 'none');
  });

  it('renders with separator role when not decorative', () => {
    const { container } = render(<Separator decorative={false} />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveAttribute('role', 'separator');
  });

  it('renders vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.className).toContain('w-px');
  });

  it('renders with label', () => {
    render(<Separator label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Separator className="my-4" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('my-4');
  });

  it('names a semantic separator with its label', async () => {
    const { container } = render(<Separator decorative={false} label="Archived" />);
    expect(screen.getByRole('separator', { name: 'Archived' })).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('leaves a decorative label as plain text', () => {
    const { container } = render(<Separator label="OR" />);
    expect(container.firstChild).not.toHaveAttribute('aria-label');
  });
});
