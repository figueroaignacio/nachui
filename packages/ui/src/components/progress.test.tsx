import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Progress } from './progress';

describe('Progress', () => {
  it('renders correctly', () => {
    render(<Progress data-testid="progress" value={50} />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('sets aria attributes correctly with value', () => {
    render(<Progress data-testid="progress" value={50} max={100} />);
    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
  });

  it('omits aria-valuenow when indeterminate (value is null/undefined)', () => {
    render(<Progress data-testid="progress" />);
    const progress = screen.getByTestId('progress');
    expect(progress).not.toHaveAttribute('aria-valuenow');
  });

  it('takes its accessible name from label', async () => {
    const { container } = render(<Progress value={40} label="Upload" />);
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('lets aria-label override label', () => {
    render(<Progress value={40} label="Upload" aria-label="Subida" />);
    expect(screen.getByRole('progressbar', { name: 'Subida' })).toBeInTheDocument();
  });
});
