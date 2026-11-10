import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { FileTree } from './file-tree';

const FILES = [
  { path: 'src/checkout/total.ts', status: 'modified' as const, additions: 12, deletions: 3 },
  { path: 'src/checkout/total.test.ts', status: 'modified' as const, additions: 2 },
  { path: 'CHANGELOG.md', status: 'added' as const, additions: 4 },
];

describe('FileTree in a real browser', () => {
  it('moves through files with the arrow keys and collapses a folder', async () => {
    const screen = await render(
      <div className="w-80 p-4">
        <button type="button">Before</button>
        <FileTree files={FILES} />
      </div>,
    );
    screen.getByRole('button', { name: 'Before' }).element().focus();
    await userEvent.tab();
    const folder = screen.getByRole('treeitem', { name: 'src/checkout' });
    await expect.element(folder).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('treeitem', { name: /^total\.test\.ts/ })).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}{ArrowLeft}');
    await expect.element(folder).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps long names inside the panel', async () => {
    const screen = await render(
      <div className="w-64">
        <FileTree
          files={[
            {
              path: 'src/a-very-long-folder-name/with-a-file-name-that-does-not-fit-anywhere.ts',
              additions: 120,
              deletions: 48,
            },
          ]}
        />
      </div>,
    );
    const panel = screen.container.querySelector('[data-slot="file-tree"]') as HTMLElement;
    expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth + 1);
  });
});
