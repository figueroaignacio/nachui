'use client';

import { ToggleGroup } from '@repo/ui/components/toggle-group';
import { cn } from '@repo/ui/lib/cn';
import * as React from 'react';
import type { ProjectFiles } from '@/lib/types';
import { CodePanel } from './code-panel';
import { PreviewPanel } from './preview-panel';

type Panel = 'preview' | 'code';
type MobileView = 'chat' | Panel;

export function WorkspaceLayout({
  header,
  chat,
  files,
  busy,
  onFix,
}: {
  header: React.ReactNode;
  chat: React.ReactNode;
  files: ProjectFiles;
  busy: boolean;
  onFix?: (report: string) => void;
}) {
  const [panel, setPanel] = React.useState<Panel>('preview');
  const [mobile, setMobile] = React.useState<MobileView>('chat');

  const switcher = (
    <ToggleGroup
      type="single"
      required
      size="sm"
      value={panel}
      onValueChange={(value) => setPanel((value || 'preview') as Panel)}
      aria-label="Show"
      className="hidden lg:flex"
    >
      <ToggleGroup.Item value="preview">Preview</ToggleGroup.Item>
      <ToggleGroup.Item value="code">Code</ToggleGroup.Item>
    </ToggleGroup>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {header}
      <div className="border-border border-b px-3 py-2 lg:hidden">
        <ToggleGroup
          type="single"
          required
          value={mobile}
          onValueChange={(value) => {
            const next = (value || 'chat') as MobileView;
            setMobile(next);
            if (next !== 'chat') setPanel(next);
          }}
          aria-label="View"
          className="bg-muted grid w-full grid-cols-3 rounded-lg p-0.5"
        >
          <ToggleGroup.Item value="chat" className="h-9">
            Chat
          </ToggleGroup.Item>
          <ToggleGroup.Item value="preview" className="h-9">
            Preview
          </ToggleGroup.Item>
          <ToggleGroup.Item value="code" className="h-9">
            Code
          </ToggleGroup.Item>
        </ToggleGroup>
      </div>
      <div className="flex min-h-0 flex-1 lg:grid lg:grid-cols-[440px_minmax(0,1fr)]">
        <section
          aria-label="Chat"
          className={cn(
            'border-border flex min-h-0 w-full flex-col lg:border-e',
            mobile !== 'chat' && 'max-lg:hidden',
          )}
        >
          {chat}
        </section>
        <div
          className={cn(
            'flex min-h-0 w-full min-w-0 flex-col',
            mobile === 'chat' && 'max-lg:hidden',
          )}
        >
          <PreviewPanel
            files={files}
            busy={busy}
            onFix={onFix}
            hidden={panel !== 'preview'}
            toolbarStart={switcher}
          />
          <CodePanel files={files} hidden={panel !== 'code'} toolbarStart={switcher} />
        </div>
      </div>
    </div>
  );
}
