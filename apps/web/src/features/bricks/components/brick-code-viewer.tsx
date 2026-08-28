'use client';

import { CodeBlock } from '@/components/mdx/codeblock';
import type { BrickSourceFile } from '@/features/bricks/lib/get-brick-source';
import { File01Icon, Folder01Icon, Folder02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tree } from '@repo/ui/components/tree';
import { Typography } from '@repo/ui/components/typography';
import type * as React from 'react';
import { useMemo, useState } from 'react';

interface BrickCodeViewerProps {
  files: BrickSourceFile[];
}

type TreeNode = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
};

function getCommonPathPrefix(paths: string[]): string {
  if (paths.length === 0) return '';
  if (paths.length === 1) {
    const parts = paths[0]!.split('/');
    parts.pop();
    return parts.join('/') + (parts.length > 0 ? '/' : '');
  }
  const parts = paths[0]!.split('/');
  let commonLen = parts.length;
  for (let i = 1; i < paths.length; i++) {
    const p = paths[i]!.split('/');
    for (let j = 0; j < commonLen; j++) {
      if (p[j] !== parts[j]) {
        commonLen = j;
        break;
      }
    }
  }
  return parts.slice(0, commonLen).join('/') + (commonLen > 0 ? '/' : '');
}

function buildTree(files: BrickSourceFile[]): TreeNode[] {
  const paths = files.map((f) => f.filePath);
  const commonPrefix = getCommonPathPrefix(paths);

  const root: TreeNode[] = [];

  for (const file of files) {
    const relativePath = file.filePath.startsWith(commonPrefix)
      ? file.filePath.slice(commonPrefix.length)
      : file.filePath;

    const parts = relativePath.split('/').filter(Boolean);
    let currentLevel = root;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      const isFile = i === parts.length - 1;

      let existingNode = currentLevel.find((n) => n.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          path: isFile ? file.filePath : currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
        };
        currentLevel.push(existingNode);
      }

      if (!isFile) {
        currentLevel = existingNode.children!;
      }
    }
  }

  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });
    nodes.forEach((n) => {
      if (n.children) sortNodes(n.children);
    });
  };

  sortNodes(root);
  return root;
}

const folderClosed = <HugeiconsIcon icon={Folder01Icon} size={16} />;
const folderOpen = <HugeiconsIcon icon={Folder02Icon} size={16} />;
const fileIcon = <HugeiconsIcon icon={File01Icon} size={16} />;

function collectFolderPaths(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) =>
    node.type === 'folder' ? [node.path, ...collectFolderPaths(node.children ?? [])] : [],
  );
}

function renderNode(node: TreeNode): React.ReactNode {
  if (node.type === 'file') {
    return (
      <Tree.Item
        key={node.path}
        value={node.path}
        label={node.name}
        icon={fileIcon}
        className="text-muted-foreground aria-selected:text-foreground"
      />
    );
  }

  return (
    <Tree.Item
      key={node.path}
      value={node.path}
      label={node.name}
      icon={folderClosed}
      iconOpen={folderOpen}
      className="text-muted-strong"
    >
      {node.children?.map(renderNode)}
    </Tree.Item>
  );
}

export function BrickCodeViewer({ files }: BrickCodeViewerProps) {
  const [activeFile, setActiveFile] = useState<string>(files[0]?.filePath ?? '');

  const tree = useMemo(() => buildTree(files), [files]);
  const activeFileContent = useMemo(
    () => files.find((f) => f.filePath === activeFile)?.code ?? '',
    [files, activeFile],
  );

  return (
    <div className="dark text-foreground bg-background flex min-h-[500px] flex-col overflow-hidden rounded-lg md:flex-row">
      <div className="flex flex-col border-b md:w-64 md:border-r md:border-b-0">
        <div className="p-3">
          <Typography
            variant="h4"
            className="text-muted-strong text-xs font-semibold tracking-wider uppercase"
          >
            Files
          </Typography>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <Tree
            selected={activeFile}
            onSelectedChange={setActiveFile}
            defaultExpanded={collectFolderPaths(tree)}
            label="Brick files"
          >
            {tree.map(renderNode)}
          </Tree>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <CodeBlock
          code={activeFileContent}
          language="tsx"
          showLineNumbers
          className="mt-0 h-full rounded-none border-0"
        />
      </div>
    </div>
  );
}
