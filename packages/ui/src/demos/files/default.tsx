'use client';

import { Files } from '../../components/files';

type FileStatus = 'modified' | 'added' | 'untracked' | 'ignored' | undefined;

interface FileNode {
  type: 'file';
  name: string;
  status?: FileStatus;
}

interface FolderNode {
  type: 'folder';
  name: string;
  status?: FileStatus;
  children: TreeNode[];
}

type TreeNode = FileNode | FolderNode;

const tree: TreeNode[] = [
  {
    type: 'folder',
    name: 'src',
    status: 'modified',
    children: [
      { type: 'file', name: 'main.tsx' },
      { type: 'file', name: 'App.tsx', status: 'modified' },
      { type: 'file', name: 'index.css' },
      {
        type: 'folder',
        name: 'components',
        children: [
          {
            type: 'folder',
            name: 'ui',
            status: 'modified',
            children: [
              { type: 'file', name: 'button.tsx' },
              { type: 'file', name: 'card.tsx', status: 'modified' },
              { type: 'file', name: 'toast.tsx', status: 'added' },
            ],
          },
          { type: 'file', name: 'header.tsx' },
          { type: 'file', name: 'footer.tsx' },
        ],
      },
      {
        type: 'folder',
        name: 'hooks',
        status: 'untracked',
        children: [
          { type: 'file', name: 'use-auth.ts', status: 'untracked' },
          { type: 'file', name: 'use-toast.ts', status: 'untracked' },
        ],
      },
      {
        type: 'folder',
        name: 'lib',
        children: [
          { type: 'file', name: 'cn.ts' },
          { type: 'file', name: 'utils.ts' },
        ],
      },
    ],
  },
  {
    type: 'folder',
    name: 'public',
    children: [{ type: 'file', name: 'favicon.svg' }],
  },
  { type: 'file', name: '.env', status: 'ignored' },
  { type: 'file', name: '.eslintrc.cjs' },
  { type: 'file', name: 'index.html' },
  { type: 'file', name: 'package.json', status: 'modified' },
  { type: 'file', name: 'tsconfig.json' },
  { type: 'file', name: 'vite.config.ts' },
];

function renderNode(node: TreeNode) {
  if (node.type === 'file') {
    return <Files.File key={node.name} name={node.name} status={node.status} />;
  }
  return (
    <Files.Folder key={node.name} name={node.name} status={node.status}>
      {node.children.map((child) => renderNode(child))}
    </Files.Folder>
  );
}

export function Default() {
  return <Files defaultValue="src/components/ui">{tree.map((node) => renderNode(node))}</Files>;
}
