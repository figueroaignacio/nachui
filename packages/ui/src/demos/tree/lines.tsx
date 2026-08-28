'use client';

import { Tree } from '../../components/tree';

export function Lines() {
  return (
    <Tree showLines defaultExpanded={['app', 'app/docs', 'app/docs/elements']} className="max-w-xs">
      <Tree.Item value="app" label="app">
        <Tree.Item value="app/docs" label="docs">
          <Tree.Item value="app/docs/elements" label="elements">
            <Tree.Item value="app/docs/elements/page.tsx" label="page.tsx" />
            <Tree.Item value="app/docs/elements/layout.tsx" label="layout.tsx" />
          </Tree.Item>
          <Tree.Item value="app/docs/page.tsx" label="page.tsx" />
        </Tree.Item>
        <Tree.Item value="app/layout.tsx" label="layout.tsx" />
        <Tree.Item value="app/globals.css" label="globals.css" />
      </Tree.Item>
      <Tree.Item value="proxy.ts" label="proxy.ts" />
    </Tree>
  );
}
