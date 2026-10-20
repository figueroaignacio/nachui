import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Resizable } from './resizable';

function Layout({ onLayout }: { onLayout?: (sizes: number[]) => void }) {
  return (
    <Resizable onLayout={onLayout}>
      <Resizable.Panel defaultSize={30} minSize={20}>
        Left
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel>Right</Resizable.Panel>
    </Resizable>
  );
}

describe('Resizable', () => {
  it('sizes panels from defaultSize and shares the rest', () => {
    render(<Layout />);
    expect(screen.getByText('Left')).toHaveStyle({ flex: '30 1 0px' });
    expect(screen.getByText('Right')).toHaveStyle({ flex: '70 1 0px' });
  });

  it('exposes the handle as a separator with the current size', () => {
    render(<Layout />);
    const handle = screen.getByRole('separator');
    expect(handle).toHaveAttribute('aria-valuenow', '30');
    expect(handle).toHaveAttribute('aria-valuemin', '20');
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('resizes with the keyboard and reports the layout', async () => {
    const onLayout = vi.fn();
    render(<Layout onLayout={onLayout} />);
    const handle = screen.getByRole('separator');
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(handle).toHaveAttribute('aria-valuenow', '32');
    expect(onLayout).toHaveBeenLastCalledWith([32, 68]);
  });

  it('respects minSize when shrinking', async () => {
    render(<Layout />);
    const handle = screen.getByRole('separator');
    handle.focus();
    await userEvent.keyboard('{Home}');
    expect(handle).toHaveAttribute('aria-valuenow', '20');
  });

  it('uses row orientation for vertical groups', () => {
    render(
      <Resizable direction="vertical">
        <Resizable.Panel>Top</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>Bottom</Resizable.Panel>
      </Resizable>,
    );
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('names the handle and points it at the panel it resizes', async () => {
    const { container } = render(<Layout />);
    const handle = screen.getByRole('separator', { name: 'Resize panels' });
    const left = screen.getByText('Left');
    expect(left.id).not.toBe('');
    expect(handle).toHaveAttribute('aria-controls', left.id);
    await expectNoAxeViolations(container);
  });

  it('accepts a translated label and keeps a custom panel id', () => {
    render(
      <Resizable>
        <Resizable.Panel id="sidebar">Left</Resizable.Panel>
        <Resizable.Handle label="Redimensionar" />
        <Resizable.Panel>Right</Resizable.Panel>
      </Resizable>,
    );
    const handle = screen.getByRole('separator', { name: 'Redimensionar' });
    expect(handle).toHaveAttribute('aria-controls', 'sidebar');
  });

  it('measures the container once and batches pointer moves into a frame', () => {
    const frames: FrameRequestCallback[] = [];
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => frames.push(callback));
    const onLayout = vi.fn();
    const { container } = render(<Layout onLayout={onLayout} />);
    const group = container.firstChild as HTMLElement;
    const width = vi.spyOn(group, 'clientWidth', 'get').mockReturnValue(1000);
    const handle = screen.getByRole('separator');
    handle.setPointerCapture = vi.fn();
    handle.hasPointerCapture = vi.fn(() => false);

    fireEvent.pointerDown(handle, { button: 0, clientX: 300, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 350, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 400, pointerId: 1 });
    expect(frames).toHaveLength(1);
    expect(width).toHaveBeenCalledTimes(1);

    act(() => frames[0]?.(0));
    expect(handle).toHaveAttribute('aria-valuenow', '40');
    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(onLayout).toHaveBeenLastCalledWith([40, 60]);
    raf.mockRestore();
  });
});
