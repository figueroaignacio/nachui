'use client';

import { CodeBlock } from '@/components/mdx/codeblock';
import type { BrickSourceFile } from '@/features/bricks/lib/get-brick-source';
import { Files } from '@repo/ui/components/files';
import { Typography } from '@repo/ui/components/typography';
import { cn } from '@repo/ui/lib/cn';
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

function FileNode({
  node,
  activeFile,
  onSelect,
}: {
  node: TreeNode;
  activeFile: string;
  onSelect: (path: string) => void;
}) {
  const isFile = node.type === 'file';
  const isActive = isFile && node.path === activeFile;

  if (isFile) {
    return (
      <Files.File
        name={node.name}
        onClick={() => onSelect(node.path)}
        className={cn(
          'transition-colors',
          isActive
            ? 'bg-white/10 font-medium text-white'
            : 'text-white/60 hover:bg-white/5 hover:text-white',
        )}
      />
    );
  }

  return (
    <Files.Folder name={node.name} className="text-white/80 transition-colors hover:text-white">
      {node.children?.map((child) => (
        <FileNode key={child.path} node={child} activeFile={activeFile} onSelect={onSelect} />
      ))}
    </Files.Folder>
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
            className="text-xs font-semibold tracking-wider text-white/80 uppercase"
          >
            Files
          </Typography>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <Files
            defaultValue={activeFile.replace(getCommonPathPrefix(files.map((f) => f.filePath)), '')}
          >
            {tree.map((node) => (
              <FileNode
                key={node.path}
                node={node}
                activeFile={activeFile}
                onSelect={setActiveFile}
              />
            ))}
          </Files>
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
