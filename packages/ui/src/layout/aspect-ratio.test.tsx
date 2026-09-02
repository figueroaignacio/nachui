import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AspectRatio } from './aspect-ratio';

describe('AspectRatio', () => {
  it('defaults to 16 by 9', () => {
    render(<AspectRatio data-testid="box">Content</AspectRatio>);
    expect(screen.getByTestId('box')).toHaveStyle({ aspectRatio: String(16 / 9) });
  });

  it('applies a custom ratio and keeps extra styles', () => {
    render(
      <AspectRatio ratio={1} style={{ maxWidth: 200 }} data-testid="box">
        Content
      </AspectRatio>,
    );
    const box = screen.getByTestId('box');
    expect(box).toHaveStyle({ aspectRatio: '1', maxWidth: '200px' });
  });

  it('renders as another element', () => {
    render(
      <AspectRatio as="figure" data-testid="box">
        Content
      </AspectRatio>,
    );
    expect(screen.getByTestId('box').tagName).toBe('FIGURE');
  });
});
