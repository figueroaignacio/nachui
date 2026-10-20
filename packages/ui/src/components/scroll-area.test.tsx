import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
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

  it('lets keyboard users focus the viewport', () => {
    const { container } = render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>,
    );
    const viewport = container.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');
    expect(viewport).toHaveAttribute('tabindex', '0');
    viewport?.focus();
    expect(viewport).toHaveFocus();
  });

  it('becomes a named region when given a label', async () => {
    const { container } = render(
      <ScrollArea label="Release notes">
        <p>Content</p>
      </ScrollArea>,
    );
    expect(screen.getByRole('region', { name: 'Release notes' })).toHaveAttribute(
      'data-slot',
      'scroll-area-viewport',
    );
    await expectNoAxeViolations(container);
  });

  it('batches scroll measurements into an animation frame', () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame');
    const { container } = render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>,
    );
    const viewport = container.querySelector('[data-slot="scroll-area-viewport"]');
    raf.mockClear();
    fireEvent.scroll(viewport as Element);
    fireEvent.scroll(viewport as Element);
    expect(raf).toHaveBeenCalledTimes(1);
    raf.mockRestore();
  });
});
