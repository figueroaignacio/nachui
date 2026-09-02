import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Center } from './center';

describe('Center', () => {
  it('centers on both axes by default', () => {
    render(<Center data-testid="center">Content</Center>);
    const center = screen.getByTestId('center');
    expect(center).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('limits centering to one axis', () => {
    render(
      <Center axis="horizontal" data-testid="center">
        Content
      </Center>,
    );
    const center = screen.getByTestId('center');
    expect(center).toHaveClass('justify-center');
    expect(center).not.toHaveClass('items-center');
  });

  it('supports inline and text centering', () => {
    render(
      <Center inline text data-testid="center">
        Content
      </Center>,
    );
    expect(screen.getByTestId('center')).toHaveClass('inline-flex', 'text-center');
  });
});
