import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './scroll-area';

describe('ScrollArea', () => {
  it('renders children inside a viewport', () => {
    render(
      <ScrollArea className="h-20">
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    const content = screen.getByText('Scrollable content');
    expect(content.closest('[data-slot="scroll-area-viewport"]')).not.toBeNull();
  });

  it('renders one scrollbar per orientation', () => {
    const { container } = render(
      <ScrollArea orientation="both">
        <p>Content</p>
      </ScrollArea>,
    );
    const bars = container.querySelectorAll('[data-slot="scroll-area-scrollbar"]');
    expect(bars).toHaveLength(2);
    expect(bars[0]).toHaveAttribute('data-orientation', 'vertical');
    expect(bars[1]).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('hides the scrollbar when nothing overflows', () => {
    const { container } = render(
      <ScrollArea type="always">
        <p>Short</p>
      </ScrollArea>,
    );
    const bar = container.querySelector('[data-slot="scroll-area-scrollbar"]');
    expect(bar).toHaveAttribute('data-state', 'hidden');
  });

  it('keeps a forced scrollbar visible', () => {
    const { container } = render(
      <ScrollArea orientation="horizontal">
        <ScrollArea.Bar orientation="vertical" forceMount />
        <p>Short</p>
      </ScrollArea>,
    );
    const bar = container.querySelector('[data-orientation="vertical"][data-state="visible"]');
    expect(bar).not.toBeNull();
  });

  it('forwards the viewport ref', () => {
    let viewport: HTMLDivElement | null = null;
    render(
      <ScrollArea
        viewportRef={(node) => {
          viewport = node;
        }}
      >
        <p>Content</p>
      </ScrollArea>,
    );
    expect(viewport).not.toBeNull();
  });
});
