'use client';

import { Sources } from '../../ai/sources';

export function Open() {
  return (
    <div className="w-full max-w-md">
      <Sources defaultOpen>
        <Sources.Trigger />
        <Sources.Content>
          <Sources.Item href="https://nextjs.org/docs/app" title="App Router – Next.js" />
          <Sources.Item
            href="https://tailwindcss.com/docs/theme"
            title="Theme variables – Tailwind"
          />
          <Sources.Item
            href="https://motion.dev/docs/react-animate-presence"
            title="AnimatePresence – Motion"
          />
          <Sources.Item href="https://vitest.dev/guide/" title="Getting started – Vitest" />
          <Sources.Item
            href="https://www.typescriptlang.org/tsconfig/"
            title="tsconfig reference – TypeScript"
          />
        </Sources.Content>
      </Sources>
    </div>
  );
}
