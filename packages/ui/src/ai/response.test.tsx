import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Response } from './response';

describe('Response', () => {
  it('renders its children as prose', () => {
    render(
      <Response>
        <p>Hello there.</p>
      </Response>,
    );
    expect(screen.getByText('Hello there.')).toBeInTheDocument();
  });

  it('shows the caret only while streaming', () => {
    const { container, rerender } = render(
      <Response>
        <p>Partial</p>
      </Response>,
    );
    expect(container.querySelector('[data-response-caret]')).not.toBeInTheDocument();
    rerender(
      <Response isStreaming>
        <p>Partial</p>
      </Response>,
    );
    expect(container.querySelector('[data-response-caret]')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true');
  });

  it('renders the skeleton lines', () => {
    render(<Response.Skeleton lines={['one', 'two', 'three']} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('three')).toBeInTheDocument();
  });

  it('renders a standalone caret', () => {
    const { container } = render(<Response.Caret />);
    expect(container.querySelector('[data-response-caret]')).toBeInTheDocument();
  });
});
