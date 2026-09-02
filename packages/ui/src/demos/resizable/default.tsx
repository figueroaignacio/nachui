'use client';

import { Resizable } from '../../components/resizable';

export function Default() {
  return (
    <Resizable className="border-border bg-card h-48 w-full max-w-md rounded-lg border">
      <Resizable.Panel defaultSize={35} minSize={20}>
        <div className="flex h-full flex-col gap-2 p-4">
          <span className="text-sm font-medium">Files</span>
          <ul className="text-muted-foreground flex flex-col gap-1 font-mono text-xs">
            <li>app/layout.tsx</li>
            <li>app/page.tsx</li>
            <li>lib/db.ts</li>
          </ul>
        </div>
      </Resizable.Panel>
      <Resizable.Handle withHandle />
      <Resizable.Panel minSize={30}>
        <div className="flex h-full items-center justify-center p-4">
          <span className="text-muted-foreground text-sm">Editor</span>
        </div>
      </Resizable.Panel>
    </Resizable>
  );
}
