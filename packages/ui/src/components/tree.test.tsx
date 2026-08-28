import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { Tree } from './tree';

vi.mock('motion/react', async () => {
  return {
    motion: {
      div: ({
        children,
        style,
        _initial,
        _animate,
        _exit,
        _variants,
        _transition,
        ref,
        ...props
      }: React.ComponentProps<'div'> & Record<string, unknown>) => (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          style={style as React.CSSProperties}
          {...(props as React.ComponentProps<'div'>)}
        >
          {children}
        </div>
      ),
    },
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

function renderTree(props: React.ComponentProps<typeof Tree> = { children: null }) {
  const { children: _children, ...rest } = props;
  return render(
    <Tree {...rest}>
      <Tree.Item value="src" label="src">
        <Tree.Item value="src/components" label="components">
          <Tree.Item value="button.tsx" label="button.tsx" />
        </Tree.Item>
        <Tree.Item value="index.ts" label="index.ts" />
      </Tree.Item>
      <Tree.Item value="package.json" label="package.json" />
      <Tree.Item value="secrets.env" label="secrets.env" disabled />
    </Tree>,
  );
}

describe('Tree', () => {
  it('renders a tree with items', () => {
    renderTree();
    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('package.json')).toBeInTheDocument();
    expect(screen.queryByText('components')).not.toBeInTheDocument();
  });

  it('expands and collapses branches on click', async () => {
    renderTree();
    const branch = screen.getByText('src');
    expect(branch.closest('[role="treeitem"]')).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(branch);
    expect(branch.closest('[role="treeitem"]')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('components')).toBeInTheDocument();

    await userEvent.click(branch);
    await waitFor(() => {
      expect(screen.queryByText('components')).not.toBeInTheDocument();
    });
  });

  it('respects defaultExpanded', () => {
    renderTree({ children: null, defaultExpanded: ['src', 'src/components'] });
    expect(screen.getByText('button.tsx')).toBeInTheDocument();
  });

  it('selects leaves and reports the value', async () => {
    const handleChange = vi.fn();
    renderTree({ children: null, onSelectedChange: handleChange });

    await userEvent.click(screen.getByText('package.json'));
    expect(handleChange).toHaveBeenCalledWith('package.json');
    expect(screen.getByText('package.json').closest('[role="treeitem"]')).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('does not select branches', async () => {
    const handleChange = vi.fn();
    renderTree({ children: null, onSelectedChange: handleChange });
    await userEvent.click(screen.getByText('src'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('supports controlled selection', () => {
    renderTree({ children: null, selected: 'package.json' });
    expect(screen.getByText('package.json').closest('[role="treeitem"]')).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('marks disabled items', () => {
    renderTree();
    expect(screen.getByText('secrets.env').closest('[role="treeitem"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('moves focus with arrow keys and expands with ArrowRight', async () => {
    renderTree();
    const src = screen.getByText('src').closest('[role="treeitem"]') as HTMLElement;
    src.focus();

    fireEvent.keyDown(src, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(src).toHaveAttribute('aria-expanded', 'true');
    });

    fireEvent.keyDown(src, { key: 'ArrowLeft' });
    await waitFor(() => {
      expect(src).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
