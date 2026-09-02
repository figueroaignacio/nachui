'use client';

import { Resizable } from '../../components/resizable';

export function Vertical() {
  return (
    <Resizable
      direction="vertical"
      className="border-border bg-card h-64 w-full max-w-md rounded-lg border"
    >
      <Resizable.Panel defaultSize={60} minSize={25}>
        <div className="flex h-full items-center justify-center p-4">
          <span className="text-sm font-medium">Preview</span>
        </div>
      </Resizable.Panel>
      <Resizable.Handle withHandle />
      <Resizable.Panel minSize={20}>
        <div className="text-muted-foreground h-full overflow-auto p-4 font-mono text-xs leading-relaxed">
          <p>$ pnpm build</p>
          <p>Compiled 42 routes in 3.1s</p>
          <p>Ready on http://localhost:3000</p>
        </div>
      </Resizable.Panel>
    </Resizable>
  );
}
