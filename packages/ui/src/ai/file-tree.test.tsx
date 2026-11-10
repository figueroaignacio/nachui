import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { FileTree, type FileChange } from './file-tree';

const FILES: FileChange[] = [
  { path: 'src/checkout/total.ts', status: 'modified', additions: 12, deletions: 3 },
  { path: 'src/checkout/total.test.ts', status: 'modified', additions: 2 },
  { path: 'src/checkout/legacy-round.ts', status: 'deleted', deletions: 9 },
  { path: 'CHANGELOG.md', status: 'added', additions: 4 },
];

describe('FileTree', () => {
  it('builds folders from paths, folds single folders and passes axe', async () => {
    const { container } = render(<FileTree files={FILES} />);
    expect(screen.getByRole('tree', { name: 'Files changed' })).toBeInTheDocument();
    const folder = screen.getByRole('treeitem', { name: 'src/checkout' });
    expect(folder).toHaveAttribute('aria-expanded', 'true');
    const names = screen.getAllByRole('treeitem').map((item) => item.getAttribute('data-value'));
    expect(names).toEqual([
      'src/checkout',
      'src/checkout/legacy-round.ts',
      'src/checkout/total.test.ts',
      'src/checkout/total.ts',
      'CHANGELOG.md',
    ]);
    await expectNoAxeViolations(container);
  });

  it('sums the changes in the header', () => {
    render(<FileTree files={FILES} />);
    expect(screen.getByText('+18')).toBeInTheDocument();
    expect(screen.getByText('-12')).toBeInTheDocument();
    expect(screen.getByText('18 additions, 12 deletions')).toBeInTheDocument();
  });

  it('names each file with its status and changes', () => {
    render(<FileTree files={FILES} />);
    expect(
      screen.getByRole('treeitem', { name: 'total.ts, Modified, 12 additions, 3 deletions' }),
    ).toBeInTheDocument();
    const deleted = screen.getByRole('treeitem', { name: /legacy-round\.ts, Deleted/ });
    expect(deleted.querySelector('[data-status="deleted"]')).toBeInTheDocument();
  });

  it('reports the picked file', async () => {
    const onFileSelect = vi.fn();
    render(<FileTree files={FILES} onFileSelect={onFileSelect} />);
    await userEvent.click(screen.getByText('total.ts'));
    expect(onFileSelect).toHaveBeenCalledWith('src/checkout/total.ts');
  });
});
