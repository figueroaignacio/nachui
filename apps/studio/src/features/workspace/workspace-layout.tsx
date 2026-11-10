'use client';

import { cn } from '@repo/ui/lib/cn';
import * as React from 'react';
import type { ProjectFiles } from '@/lib/types';
import { CodePanel } from './code-panel';
import { PreviewPanel } from './preview-panel';
import { ViewTabs } from './view-tabs';

type Panel = 'preview' | 'code';
type MobileView = 'chat' | Panel;

const PANELS = [
  { value: 'preview', label: 'Preview' },
  { value: 'code', label: 'Code' },
] as const;

const MOBILE_VIEWS = [
  { value: 'chat', label: 'Chat' },
  { value: 'preview', label: 'Preview' },
  { value: 'code', label: 'Code' },
] as const;

/**
 * Chat on the left, preview or code on the right. On phones one view shows at a time and the
 * switch sits in the header, so `header` receives it to place at its end.
 */
export function WorkspaceLayout({
  header,
  chat,
  files,
  busy,
  onFix,
  actions,
}: {
  header: (end: React.ReactNode) => React.ReactNode;
  chat: React.ReactNode;
  files: ProjectFiles;
  busy: boolean;
  onFix?: (report: string) => void;
  actions?: React.ReactNode;
}) {
  const [panel, setPanel] = React.useState<Panel>('preview');
  const [mobile, setMobile] = React.useState<MobileView>('chat');

  const desktopSwitch = (
    <ViewTabs
      label="Show"
      value={panel}
      onValueChange={setPanel}
      options={PANELS}
      className="hidden lg:flex"
    />
  );

  const mobileSwitch = (
    <ViewTabs
      label="View"
      value={mobile}
      onValueChange={(next) => {
        setMobile(next);
        if (next !== 'chat') setPanel(next);
      }}
      options={MOBILE_VIEWS}
      className="lg:hidden"
    />
  );

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="lg:hidden">{header(mobileSwitch)}</div>
      <section
        aria-label="Chat"
        className={cn(
          'border-border flex min-h-0 w-full flex-1 flex-col lg:w-[440px] lg:flex-none lg:border-e',
          mobile !== 'chat' && 'max-lg:hidden',
        )}
      >
        <div className="hidden lg:block">{header(null)}</div>
        {chat}
      </section>
      <div
        className={cn(
          'flex min-h-0 w-full min-w-0 flex-1 flex-col',
          mobile === 'chat' && 'max-lg:hidden',
        )}
      >
        <PreviewPanel
          files={files}
          busy={busy}
          onFix={onFix}
          hidden={panel !== 'preview'}
          toolbarStart={desktopSwitch}
          actions={actions}
        />
        <CodePanel
          files={files}
          hidden={panel !== 'code'}
          toolbarStart={desktopSwitch}
          actions={actions}
        />
      </div>
    </div>
  );
}
