'use client';

import { Tree } from '../../components/tree';
import { FileIcon } from '../../icons/file';
import { FolderIcon } from '../../icons/folder';
import { FolderOpenIcon } from '../../icons/folder-open';

const folderClosed = <FolderIcon size={16} />;
const folderOpen = <FolderOpenIcon size={16} />;
const file = <FileIcon size={16} />;

export function Icons() {
  return (
    <Tree defaultExpanded={['packages', 'packages/ui']} className="max-w-xs">
      <Tree.Item value="packages" label="packages" icon={folderClosed} iconOpen={folderOpen}>
        <Tree.Item value="packages/ui" label="ui" icon={folderClosed} iconOpen={folderOpen}>
          <Tree.Item value="packages/ui/tree.tsx" label="tree.tsx" icon={file} />
          <Tree.Item value="packages/ui/frame.tsx" label="frame.tsx" icon={file} />
        </Tree.Item>
        <Tree.Item value="packages/cli" label="cli" icon={folderClosed} iconOpen={folderOpen}>
          <Tree.Item value="packages/cli/index.ts" label="index.ts" icon={file} />
        </Tree.Item>
      </Tree.Item>
      <Tree.Item value="turbo.json" label="turbo.json" icon={file} />
    </Tree>
  );
}
