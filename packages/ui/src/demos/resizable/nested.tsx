'use client';

import { Resizable } from '../../components/resizable';

export function Nested() {
  return (
    <Resizable className="border-border bg-card h-64 w-full max-w-md rounded-lg border">
      <Resizable.Panel defaultSize={28} minSize={15}>
        <div className="flex h-full items-center justify-center p-4">
          <span className="text-muted-foreground text-sm">Sidebar</span>
        </div>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel minSize={30}>
        <Resizable direction="vertical">
          <Resizable.Panel defaultSize={65} minSize={30}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm font-medium">Editor</span>
            </div>
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel minSize={15}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-muted-foreground text-sm">Terminal</span>
            </div>
          </Resizable.Panel>
        </Resizable>
      </Resizable.Panel>
    </Resizable>
  );
}
