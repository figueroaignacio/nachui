import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Tree } from './tree';

vi.mock('motion/react');

function renderTree(props: Omit<React.ComponentProps<typeof Tree>, 'children'> = {}) {
  return render(
    <Tree {...props}>
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
    renderTree({ defaultExpanded: ['src', 'src/components'] });
    expect(screen.getByText('button.tsx')).toBeInTheDocument();
  });

  it('selects leaves and reports the value', async () => {
    const handleChange = vi.fn();
    renderTree({ onSelectedChange: handleChange });

    await userEvent.click(screen.getByText('package.json'));
    expect(handleChange).toHaveBeenCalledWith('package.json');
    expect(screen.getByText('package.json').closest('[role="treeitem"]')).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('does not select branches', async () => {
    const handleChange = vi.fn();
    renderTree({ onSelectedChange: handleChange });
    await userEvent.click(screen.getByText('src'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('supports controlled selection', () => {
    renderTree({ selected: 'package.json' });
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

function item(name: string) {
  const label = screen.getByText(name);
  const treeitem = label.closest('[role="treeitem"]');
  if (!(treeitem instanceof HTMLElement)) throw new Error(`no treeitem for ${name}`);
  return treeitem;
}

describe('Tree structure', () => {
  it('nests each group inside the treeitem that owns it', () => {
    renderTree({ defaultExpanded: ['src'] });
    const src = item('src');
    const group = within(src).getAllByRole('group')[0];
    expect(group).toContainElement(item('index.ts'));
  });

  it('names items by their label only', () => {
    renderTree({ defaultExpanded: ['src', 'src/components'] });
    expect(screen.getByRole('treeitem', { name: 'src' })).toBe(item('src'));
  });

  it('respects reduced motion on the chevron', () => {
    renderTree();
    const chevron = item('src').querySelector('.transition-transform');
    expect(chevron).toHaveClass('motion-reduce:transition-none');
  });

  it('has no axe violations', async () => {
    const { container } = renderTree({ defaultExpanded: ['src'] });
    await expectNoAxeViolations(container);
  });
});

describe('Tree expansion state', () => {
  it('supports controlled expansion', async () => {
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <Tree expanded={[]} onExpandedChange={onExpandedChange}>
        <Tree.Item value="src" label="src">
          <Tree.Item value="index.ts" label="index.ts" />
        </Tree.Item>
      </Tree>,
    );

    await userEvent.click(screen.getByText('src'));
    expect(onExpandedChange).toHaveBeenCalledWith(['src']);
    expect(item('src')).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <Tree expanded={['src']} onExpandedChange={onExpandedChange}>
        <Tree.Item value="src" label="src">
          <Tree.Item value="index.ts" label="index.ts" />
        </Tree.Item>
      </Tree>,
    );
    expect(item('src')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('index.ts')).toBeInTheDocument();
  });

  it('reports uncontrolled changes', async () => {
    const onExpandedChange = vi.fn();
    renderTree({ defaultExpanded: ['src'], onExpandedChange });
    await userEvent.click(screen.getByText('components'));
    expect(onExpandedChange).toHaveBeenLastCalledWith(['src', 'src/components']);
  });

  it('only re-renders the items whose state changed', async () => {
    const renders = vi.fn();
    render(
      <Tree>
        <Tree.Item value="src" label="src">
          <Tree.Item value="index.ts" label="index.ts" />
        </Tree.Item>
        <React.Profiler id="sibling" onRender={renders}>
          <Tree.Item value="package.json" label="package.json" />
        </React.Profiler>
      </Tree>,
    );
    renders.mockClear();

    await userEvent.click(screen.getByText('src'));
    expect(item('src')).toHaveAttribute('aria-expanded', 'true');
    expect(renders).not.toHaveBeenCalled();
  });

  it('returns focus to the parent when a controlled collapse removes the focused item', async () => {
    function Controlled({ expanded }: { expanded: string[] }) {
      return (
        <Tree expanded={expanded}>
          <Tree.Item value="src" label="src">
            <Tree.Item value="index.ts" label="index.ts" />
          </Tree.Item>
        </Tree>
      );
    }
    const { rerender } = render(<Controlled expanded={['src']} />);
    act(() => item('index.ts').focus());
    rerender(<Controlled expanded={[]} />);
    await waitFor(() => {
      expect(item('src')).toHaveFocus();
    });
  });
});

describe('Tree keyboard', () => {
  it('keeps disabled items focusable but never activates them', async () => {
    const handleChange = vi.fn();
    renderTree({ onSelectedChange: handleChange });
    const pkg = item('package.json');
    act(() => pkg.focus());

    fireEvent.keyDown(pkg, { key: 'ArrowDown' });
    const secrets = item('secrets.env');
    expect(secrets).toHaveFocus();

    fireEvent.keyDown(secrets, { key: 'Enter' });
    await userEvent.click(screen.getByText('secrets.env'));
    expect(handleChange).not.toHaveBeenCalled();
    expect(secrets).toHaveAttribute('aria-selected', 'false');
  });

  it('skips items inside groups that are closing', () => {
    renderTree({ defaultExpanded: ['src'] });
    const group = within(item('src')).getAllByRole('group')[0]!;
    group.setAttribute('inert', '');
    const src = item('src');
    act(() => src.focus());
    fireEvent.keyDown(src, { key: 'ArrowDown' });
    expect(item('package.json')).toHaveFocus();
  });

  it('jumps to items by typing the start of their label', () => {
    renderTree({ defaultExpanded: ['src'] });
    const src = item('src');
    act(() => src.focus());

    const now = vi.spyOn(Date, 'now').mockReturnValue(1000);
    fireEvent.keyDown(src, { key: 'p' });
    expect(item('package.json')).toHaveFocus();

    now.mockReturnValue(2000);
    fireEvent.keyDown(item('package.json'), { key: 'i' });
    expect(item('index.ts')).toHaveFocus();
    fireEvent.keyDown(item('index.ts'), { key: 'n' });
    expect(item('index.ts')).toHaveFocus();
    now.mockRestore();
  });

  it('expands every sibling branch with *', () => {
    render(
      <Tree>
        <Tree.Item value="a" label="a">
          <Tree.Item value="a1" label="a1" />
        </Tree.Item>
        <Tree.Item value="b" label="b">
          <Tree.Item value="b1" label="b1" />
        </Tree.Item>
        <Tree.Item value="c" label="c" />
      </Tree>,
    );
    const a = item('a');
    act(() => a.focus());
    fireEvent.keyDown(a, { key: '*' });
    expect(item('a')).toHaveAttribute('aria-expanded', 'true');
    expect(item('b')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('b1')).toBeInTheDocument();
    expect(a).toHaveFocus();
  });

  it('keeps a single tab stop that follows focus', async () => {
    const user = userEvent.setup();
    renderTree();
    await user.tab();
    expect(item('src')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(item('package.json')).toHaveAttribute('tabindex', '0');
    expect(item('src')).toHaveAttribute('tabindex', '-1');
  });
});
