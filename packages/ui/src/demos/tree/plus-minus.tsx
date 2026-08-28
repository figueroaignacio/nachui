'use client';

import { File01Icon, Folder01Icon, Folder02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tree } from '../../components/tree';

const folderClosed = <HugeiconsIcon icon={Folder01Icon} size={16} />;
const folderOpen = <HugeiconsIcon icon={Folder02Icon} size={16} />;
const file = <HugeiconsIcon icon={File01Icon} size={16} />;

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
