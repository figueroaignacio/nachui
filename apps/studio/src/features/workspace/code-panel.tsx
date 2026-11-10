'use client';

import { CodeBlock } from '@repo/ui/ai/code-block';
import { FileTree } from '@repo/ui/ai/file-tree';
import * as React from 'react';
import type { ProjectFiles } from '@/lib/types';
import { installCommand } from './install-command';

export function CodePanel({
  files,
  hidden,
  toolbarStart,
  actions,
}: {
  files: ProjectFiles;
  hidden?: boolean;
  toolbarStart?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const paths = React.useMemo(() => Object.keys(files).sort(), [files]);
  const [selected, setSelected] = React.useState<string | undefined>(paths[0]);
  const current = selected && selected in files ? selected : paths[0];
  const command = React.useMemo(() => installCommand(files), [files]);

  return (
    <section aria-label="Code" hidden={hidden} className="flex min-h-0 flex-1 flex-col">
      {toolbarStart || actions ? (
        <div className="border-border flex h-12 shrink-0 items-center gap-2 border-b px-3">
          {toolbarStart}
          <span className="flex-1" />
          {actions}
        </div>
      ) : null}
      {command ? (
        <div className="border-border flex shrink-0 flex-col gap-1.5 border-b px-3 py-2.5">
          <span className="text-muted-foreground text-xs">Install what it uses</span>
          <CodeBlock code={command} language="bash">
            <CodeBlock.CopyButton copyLabel="Copy command" />
            <CodeBlock.Content label="Install command" className="py-2 pe-12" />
          </CodeBlock>
        </div>
      ) : null}
      {paths.length === 0 ? (
        <p className="text-muted-foreground p-6 text-sm">No files yet.</p>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="border-border shrink-0 border-b p-3 md:w-64 md:border-e md:border-b-0">
            <FileTree
              title="Project files"
              files={paths.map((path) => ({ path }))}
              selected={current}
              onFileSelect={setSelected}
            />
            <p className="text-muted-foreground mt-3 px-1 text-xs leading-relaxed">
              NachUI files come from the CLI, so only your screen lives here.
            </p>
          </div>
          <div className="min-h-0 min-w-0 flex-1 overflow-auto p-3">
            {current ? (
              <CodeBlock code={files[current] ?? ''} language="tsx" showLineNumbers>
                <CodeBlock.CopyButton copyLabel="Copy file" />
                <CodeBlock.Content label={current} />
              </CodeBlock>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
