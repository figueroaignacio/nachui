import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Flex } from './flex';

describe('Flex', () => {
  it('renders children correctly', () => {
    render(<Flex>Test Flex</Flex>);
    expect(screen.getByText('Test Flex')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Flex data-testid="flex">Content</Flex>);
    const flex = screen.getByTestId('flex');
    expect(flex).toHaveClass('flex');
    expect(flex).toHaveClass('flex-row');
    expect(flex).toHaveClass('items-stretch');
    expect(flex).toHaveClass('justify-start');
    expect(flex).toHaveClass('flex-nowrap');
  });

  it('applies custom variant classes', () => {
    render(
      <Flex
        direction="column"
        align="center"
        justify="between"
        wrap="wrap"
        gap="4"
        data-testid="flex"
      >
        Content
      </Flex>,
    );
    const flex = screen.getByTestId('flex');
    expect(flex).toHaveClass('flex-col');
    expect(flex).toHaveClass('items-center');
    expect(flex).toHaveClass('justify-between');
    expect(flex).toHaveClass('flex-wrap');
    expect(flex).toHaveClass('gap-4');
  });

  it('renders as a custom element', () => {
    render(
      <Flex as="section" data-testid="flex">
        Content
      </Flex>,
    );
    const flex = screen.getByTestId('flex');
    expect(flex.tagName).toBe('SECTION');
  });
});
