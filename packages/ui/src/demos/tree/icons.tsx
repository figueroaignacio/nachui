'use client';

import { File01Icon, Folder01Icon, Folder02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tree } from '../../components/tree';

const folderClosed = <HugeiconsIcon icon={Folder01Icon} size={16} />;
const folderOpen = <HugeiconsIcon icon={Folder02Icon} size={16} />;
const file = <HugeiconsIcon icon={File01Icon} size={16} />;

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
