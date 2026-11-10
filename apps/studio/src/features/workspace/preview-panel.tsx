'use client';

import { Shimmer } from '@repo/ui/ai/shimmer';
import { StackTrace } from '@repo/ui/ai/stack-trace';
import { Button } from '@repo/ui/components/button';
import { Skeleton } from '@repo/ui/components/skeleton';
import { ToggleGroup } from '@repo/ui/components/toggle-group';
import { RefreshIcon } from '@repo/ui/icons/refresh';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { landIn, useEntrance } from '@/features/shell/motion';
import { usePreviewFrame, type PreviewError } from '../preview/use-preview-frame';
import type { ProjectFiles } from '@/lib/types';
import { DesktopIcon, PhoneIcon, TabletIcon } from './device-icons';

const WIDTHS = { desktop: '100%', tablet: '768px', phone: '390px' } as const;
type Device = keyof typeof WIDTHS;

export function errorReport(error: PreviewError): string {
  return [`${error.name}: ${error.message}`, error.stack ?? ''].join('\n').trim();
}

function BuildingSkeleton({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-4 p-8 sm:p-10">
      <Skeleton className="h-7 w-44" />
      <Skeleton className="h-3.5 w-72 max-w-full" />
      <Skeleton className="mt-3 h-28 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-36 rounded-xl" />
      <Shimmer className="mx-auto mt-1 text-sm">{label}</Shimmer>
    </div>
  );
}

export function PreviewPanel({
  files,
  busy,
  onFix,
  hidden,
  toolbarStart,
  actions,
}: {
  files: ProjectFiles;
  busy: boolean;
  onFix?: (report: string) => void;
  hidden?: boolean;
  toolbarStart?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [device, setDevice] = React.useState<Device>('desktop');
  const { frameRef, srcDoc, frameKey, status, error, reload, dismissError } =
    usePreviewFrame(files);
  const land = useEntrance(landIn);
  const [landed, setLanded] = React.useState(false);
  if (status === 'rendered' && !landed) setLanded(true);

  const working = busy || status === 'building' || status === 'loading';
  const waitingForFirst = !landed && status !== 'empty' && status !== 'error';

  return (
    <section aria-label="Preview" hidden={hidden} className="flex min-h-0 flex-1 flex-col">
      <div className="border-border flex h-12 shrink-0 items-center gap-2 border-b px-3">
        {toolbarStart}
        <ToggleGroup
          type="single"
          required
          size="sm"
          value={device}
          onValueChange={(value) => setDevice((value || 'desktop') as Device)}
          aria-label="Preview width"
          className="ms-1 hidden md:flex"
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
        <span aria-live="polite" className="flex min-w-0 flex-1 justify-center text-xs">
          {working && landed ? (
            <Shimmer className="truncate">
              {busy ? 'Updating as the agent writes' : 'Building the preview'}
            </Shimmer>
          ) : null}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Reload preview"
          className="size-8"
          onClick={reload}
        >
          <RefreshIcon size={15} />
        </Button>
        {actions}
      </div>
      <div className="bg-surface-muted studio-dots relative min-h-0 flex-1 overflow-auto p-3 sm:p-5">
        <motion.div
          initial={false}
          animate={landed ? 'visible' : 'hidden'}
          variants={land}
          className="border-border bg-background mx-auto h-full min-h-[480px] overflow-hidden rounded-xl border shadow-lg transition-[max-width] duration-300 motion-reduce:transition-none"
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
        </motion.div>
        <AnimatePresence>
          {waitingForFirst ? (
            <motion.div
              key="building"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
              className="absolute inset-3 sm:inset-5"
            >
              <div
                className="border-border bg-background mx-auto h-full overflow-hidden rounded-xl border"
                style={{ maxWidth: WIDTHS[device] }}
              >
                <BuildingSkeleton
                  label={busy ? 'Waiting for the first file' : 'Building preview'}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
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
