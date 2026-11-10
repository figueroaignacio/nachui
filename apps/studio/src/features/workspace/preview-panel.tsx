'use client';

import { StackTrace } from '@repo/ui/ai/stack-trace';
import { Button } from '@repo/ui/components/button';
import { Spinner } from '@repo/ui/components/spinner';
import { ToggleGroup } from '@repo/ui/components/toggle-group';
import { RefreshIcon } from '@repo/ui/icons/refresh';
import { cn } from '@repo/ui/lib/cn';
import * as React from 'react';
import { usePreviewFrame, type PreviewError } from '../preview/use-preview-frame';
import type { ProjectFiles } from '@/lib/types';
import { DesktopIcon, PhoneIcon, TabletIcon } from './device-icons';

const WIDTHS = { desktop: '100%', tablet: '768px', phone: '390px' } as const;
type Device = keyof typeof WIDTHS;

export function errorReport(error: PreviewError): string {
  return [`${error.name}: ${error.message}`, error.stack ?? ''].join('\n').trim();
}

export function PreviewPanel({
  files,
  busy,
  onFix,
  hidden,
  toolbarStart,
}: {
  files: ProjectFiles;
  busy: boolean;
  onFix?: (report: string) => void;
  hidden?: boolean;
  toolbarStart?: React.ReactNode;
}) {
  const [device, setDevice] = React.useState<Device>('desktop');
  const { frameRef, srcDoc, frameKey, status, error, reload, dismissError } =
    usePreviewFrame(files);

  return (
    <section aria-label="Preview" hidden={hidden} className="flex min-h-0 flex-1 flex-col">
      <div className="border-border flex h-11 shrink-0 items-center gap-3 border-b px-3">
        {toolbarStart}
        <span className="text-muted-foreground flex min-w-0 flex-1 items-center gap-2 text-xs">
          {busy || status === 'building' || status === 'loading' ? (
            <>
              <Spinner size="sm" />
              <span>{busy ? 'Updating as the agent writes' : 'Building the preview'}</span>
            </>
          ) : null}
        </span>
        <ToggleGroup
          type="single"
          required
          size="sm"
          value={device}
          onValueChange={(value) => setDevice((value || 'desktop') as Device)}
          aria-label="Preview width"
          className="hidden md:flex"
        >
          <ToggleGroup.Item value="desktop" aria-label="Desktop width">
            <DesktopIcon />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="tablet" aria-label="Tablet width">
            <TabletIcon />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="phone" aria-label="Phone width">
            <PhoneIcon />
          </ToggleGroup.Item>
        </ToggleGroup>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Reload preview"
          className="size-8"
          onClick={reload}
        >
          <RefreshIcon size={15} />
        </Button>
      </div>
      <div className="bg-surface-muted relative min-h-0 flex-1 overflow-auto p-3 sm:p-5">
        <div
          className={cn(
            'border-border bg-background mx-auto h-full min-h-[480px] overflow-hidden rounded-xl border transition-[max-width] duration-300 motion-reduce:transition-none',
          )}
          style={{ maxWidth: WIDTHS[device] }}
        >
          {srcDoc ? (
            <iframe
              key={frameKey}
              ref={frameRef}
              title="Screen preview"
              sandbox="allow-scripts allow-forms"
              srcDoc={srcDoc}
              className="size-full border-0"
            />
          ) : null}
        </div>
        {status === 'empty' && !busy ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <p className="text-muted-foreground max-w-xs text-center text-sm">
              The screen shows up here as soon as the first file is written.
            </p>
          </div>
        ) : null}
        {error && !busy ? (
          <div className="bg-background/70 absolute inset-0 flex items-center justify-center p-4 backdrop-blur-sm sm:p-10">
            <div role="alert" className="flex w-full max-w-xl flex-col gap-3">
              <StackTrace
                stack={
                  error.stack && error.stack.includes(error.message)
                    ? error.stack
                    : errorReport(error)
                }
                className="shadow-lg"
              >
                <StackTrace.Header>
                  <StackTrace.CopyButton />
                </StackTrace.Header>
                <StackTrace.Frames />
              </StackTrace>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={dismissError}>
                  Dismiss
                </Button>
                {onFix ? (
                  <Button size="sm" onClick={() => onFix(errorReport(error))}>
                    Fix it
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
