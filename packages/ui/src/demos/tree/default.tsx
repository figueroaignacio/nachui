'use client';

import { Tree } from '../../components/tree';

export function Default() {
  return (
    <Tree defaultExpanded={['src', 'src/components']} className="max-w-xs">
      <Tree.Item value="src" label="src">
        <Tree.Item value="src/components" label="components">
          <Tree.Item value="src/components/button.tsx" label="button.tsx" />
          <Tree.Item value="src/components/card.tsx" label="card.tsx" />
          <Tree.Item value="src/components/tree.tsx" label="tree.tsx" />
        </Tree.Item>
        <Tree.Item value="src/hooks" label="hooks">
          <Tree.Item value="src/hooks/use-local-storage.ts" label="use-local-storage.ts" />
        </Tree.Item>
        <Tree.Item value="src/index.ts" label="index.ts" />
      </Tree.Item>
      <Tree.Item value="package.json" label="package.json" />
      <Tree.Item value="tsconfig.json" label="tsconfig.json" />
    </Tree>
  );
}
