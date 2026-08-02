import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Kbd, KbdGroup } from './kbd';

describe('Kbd', () => {
  it('renders correctly with default styles', () => {
    render(<Kbd>Ctrl</Kbd>);
    const element = screen.getByText('Ctrl');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('KBD');
    expect(element).toHaveClass('font-mono', 'text-[11px]', 'bg-muted/50');
  });

  it('applies the abbrTitle attribute correctly', () => {
    render(<Kbd abbrTitle="Control">Ctrl</Kbd>);
    expect(screen.getByText('Ctrl')).toHaveAttribute('title', 'Control');
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<Kbd size="sm">K</Kbd>);
    let element = screen.getByText('K');
    expect(element).toHaveClass('h-5', 'px-1.5', 'text-[10px]');

    rerender(<Kbd size="lg">K</Kbd>);
    element = screen.getByText('K');
    expect(element).toHaveClass('h-8', 'px-2.5', 'text-[13px]');
  });

  it('renders outline variant correctly', () => {
    render(<Kbd variant="outline">Alt</Kbd>);
    const element = screen.getByText('Alt');
    expect(element).toHaveClass('bg-transparent', 'text-foreground');
  });

  it('passes additional classes and props to Kbd as custom components do', () => {
    render(
      <Kbd className="custom-class" data-testid="test-kbd">
        X
      </Kbd>,
    );
    const element = screen.getByTestId('test-kbd');
    expect(element).toHaveClass('custom-class');
  });
});

describe('KbdGroup', () => {
  it('renders correctly with default styles', () => {
    render(
      <KbdGroup data-testid="test-group">
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    const groupElement = screen.getByTestId('test-group');
    expect(groupElement).toBeInTheDocument();
    expect(groupElement.tagName).toBe('SPAN');
    expect(groupElement).toHaveClass('inline-flex', 'items-center', 'gap-1');

    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });
});
