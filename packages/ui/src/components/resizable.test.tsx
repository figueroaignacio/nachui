import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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
});
