'use client';

import { Tree } from '../../components/tree';
import { FileIcon } from '../../icons/file';
import { FolderIcon } from '../../icons/folder';
import { FolderOpenIcon } from '../../icons/folder-open';

const folderClosed = <FolderIcon size={16} />;
const folderOpen = <FolderOpenIcon size={16} />;
const file = <FileIcon size={16} />;

export function PlusMinus() {
  return (
    <Tree
      toggleIcon="plus-minus"
      showLines
      defaultExpanded={['content', 'content/docs']}
      className="max-w-xs"
    >
      <Tree.Item value="content" label="content" icon={folderClosed} iconOpen={folderOpen}>
        <Tree.Item value="content/docs" label="docs" icon={folderClosed} iconOpen={folderOpen}>
          <Tree.Item value="content/docs/en" label="en" icon={folderClosed} iconOpen={folderOpen}>
            <Tree.Item value="content/docs/en/tree.mdx" label="tree.mdx" icon={file} />
          </Tree.Item>
          <Tree.Item value="content/docs/es" label="es" icon={folderClosed} iconOpen={folderOpen}>
            <Tree.Item value="content/docs/es/tree.mdx" label="tree.mdx" icon={file} />
          </Tree.Item>
        </Tree.Item>
      </Tree.Item>
      <Tree.Item value="README.md" label="README.md" icon={file} />
    </Tree>
  );
}
