'use client';

import * as React from 'react';
import { Tree } from '../components/tree';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function Svg({ size = 24, strokeWidth = 1.5, children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

function FolderIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Svg>
  );
}

function FileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </Svg>
  );
}

type FileChangeStatus = 'added' | 'modified' | 'deleted' | 'renamed';

type FileChangeStatusLabels = Record<FileChangeStatus, string>;

interface FileChange {
  path: string;
  status?: FileChangeStatus;
  additions?: number;
  deletions?: number;
}

interface FileTreeNode {
  name: string;
  path: string;
  file?: FileChange;
  children: FileTreeNode[];
}

const DEFAULT_STATUS_LABELS: FileChangeStatusLabels = {
  added: 'Added',
  modified: 'Modified',
  deleted: 'Deleted',
  renamed: 'Renamed',
};

const STATUS_LETTER: Record<FileChangeStatus, string> = {
  added: 'A',
  modified: 'M',
  deleted: 'D',
  renamed: 'R',
};

const STATUS_TONE: Record<FileChangeStatus, string> = {
  added: 'text-success-text',
  modified: 'text-warning-text',
  deleted: 'text-destructive-text',
  renamed: 'text-info-text',
};

function buildTree(files: FileChange[]): FileTreeNode[] {
  const root: FileTreeNode = { name: '', path: '', children: [] };

  for (const file of files) {
    const parts = file.path.split('/').filter(Boolean);
    let node = root;
    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join('/');
      const isFile = index === parts.length - 1;
      let child = node.children.find((candidate) => candidate.path === path && !candidate.file);
      if (isFile) {
        node.children.push({ name: part, path, file, children: [] });
        return;
      }
      if (!child) {
        child = { name: part, path, children: [] };
        node.children.push(child);
      }
      node = child;
    });
  }

  const compact = (node: FileTreeNode): FileTreeNode => {
    let current = node;
    while (!current.file && current.children.length === 1 && !current.children[0]?.file) {
      const only = current.children[0] as FileTreeNode;
      current = { ...only, name: `${current.name}/${only.name}` };
    }
    const children = current.children.map(compact).sort((a, b) => {
      if (!a.file !== !b.file) return a.file ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
    return { ...current, children };
  };

  return compact(root).children;
}

function collectFolders(nodes: FileTreeNode[]): string[] {
  return nodes.flatMap((node) => (node.file ? [] : [node.path, ...collectFolders(node.children)]));
}

interface FileTreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  files: FileChange[];
  title?: React.ReactNode;
  label?: string;
  selected?: string;
  defaultSelected?: string;
  onFileSelect?: (path: string) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  statusLabels?: Partial<FileChangeStatusLabels>;
  changesLabel?: (additions: number, deletions: number) => string;
}

const FileTree = ({
  className,
  files,
  title = 'Files changed',
  label,
  selected,
  defaultSelected,
  onFileSelect,
  expanded,
  defaultExpanded,
  onExpandedChange,
  statusLabels,
  changesLabel = (additions, deletions) =>
    `${additions} ${additions === 1 ? 'addition' : 'additions'}, ${deletions} ${deletions === 1 ? 'deletion' : 'deletions'}`,
  ref,
  ...props
}: FileTreeProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const nodes = React.useMemo(() => buildTree(files), [files]);
  const allFolders = React.useMemo(() => collectFolders(nodes), [nodes]);
  const additions = files.reduce((sum, file) => sum + (file.additions ?? 0), 0);
  const deletions = files.reduce((sum, file) => sum + (file.deletions ?? 0), 0);
  const hasCounts = files.some(
    (file) => file.additions !== undefined || file.deletions !== undefined,
  );

  const renderNode = (node: FileTreeNode): React.ReactNode => {
    if (!node.file) {
      return (
        <Tree.Item
          key={node.path}
          value={node.path}
          label={<span className="font-mono text-xs">{node.name}</span>}
          icon={<FolderIcon />}
        >
          {node.children.map(renderNode)}
        </Tree.Item>
      );
    }

    const { status, additions: added, deletions: removed } = node.file;
    const fileHasCounts = added !== undefined || removed !== undefined;

    return (
      <Tree.Item
        key={node.path}
        value={node.path}
        icon={<FileIcon />}
        label={
          <span
            data-slot="file-tree-file"
            data-status={status}
            className="flex w-full min-w-0 items-center gap-2 font-mono text-xs"
          >
            <span
              className={cn(
                'min-w-0 flex-1 truncate',
                status === 'deleted' && 'text-muted-foreground line-through',
              )}
            >
              {node.name}
            </span>
            {fileHasCounts ? (
              <span aria-hidden="true" className="flex shrink-0 gap-1.5 tabular-nums">
                {added ? <span className="text-success-text">{`+${added}`}</span> : null}
                {removed ? <span className="text-destructive-text">{`-${removed}`}</span> : null}
              </span>
            ) : null}
            {status ? (
              <span
                aria-hidden="true"
                className={cn('w-3 shrink-0 text-center font-medium', STATUS_TONE[status])}
              >
                {STATUS_LETTER[status]}
              </span>
            ) : null}
            <span className="sr-only">
              {[
                status ? (statusLabels?.[status] ?? DEFAULT_STATUS_LABELS[status]) : null,
                fileHasCounts ? changesLabel(added ?? 0, removed ?? 0) : null,
              ]
                .filter(Boolean)
                .map((part) => `, ${part}`)
                .join('')}
            </span>
          </span>
        }
      />
    );
  };

  return (
    <div
      ref={ref}
      data-slot="file-tree"
      className={cn(
        'border-border bg-card text-card-foreground w-full min-w-0 overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      <div
        data-slot="file-tree-header"
        className="bg-surface-muted border-border text-muted-strong flex min-h-10 items-center gap-2 border-b px-3 font-mono text-xs"
      >
        <span className="text-foreground min-w-0 flex-1 truncate">{title}</span>
        {hasCounts ? (
          <span className="flex shrink-0 gap-1.5 tabular-nums">
            <span aria-hidden="true" className="text-success-text">{`+${additions}`}</span>
            <span aria-hidden="true" className="text-destructive-text">{`-${deletions}`}</span>
            <span className="sr-only">{changesLabel(additions, deletions)}</span>
          </span>
        ) : null}
      </div>
      <div className="p-1.5 text-sm">
        <Tree
          label={label ?? (typeof title === 'string' ? title : 'Files')}
          selected={selected}
          defaultSelected={defaultSelected}
          onSelectedChange={onFileSelect}
          expanded={expanded}
          defaultExpanded={defaultExpanded ?? allFolders}
          onExpandedChange={onExpandedChange}
          indent={14}
        >
          {nodes.map(renderNode)}
        </Tree>
      </div>
    </div>
  );
};

FileTree.displayName = 'FileTree';

export { FileTree };
export type { FileChange, FileChangeStatus, FileChangeStatusLabels, FileTreeProps };
