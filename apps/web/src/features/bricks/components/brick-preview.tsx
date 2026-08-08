'use client';

import type { BrickSourceFile } from '@/features/bricks/lib/get-brick-source';
import { useCopyToClipboard } from '@/features/docs/hooks/use-copy-to-clipboard';
import { LaptopIcon, Tick02Icon, Copy01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tabs } from '@repo/ui/components/tabs';
import { cn } from '@repo/ui/lib/cn';
import { useState } from 'react';
import { BrickCodeViewer } from './brick-code-viewer';

interface BrickPreviewProps {
  id: string;
  name: string;
  description: string;
  children: React.ReactNode;
  files: BrickSourceFile[] | null;
  installCommand?: string;
}

type ViewportSize = 'desktop' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: 'w-full',
  mobile: 'max-w-[375px]',
};

export function BrickPreview({
  id,
  name,
  description,
  children,
  files,
  installCommand,
}: BrickPreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const { isCopied, copyToClipboard } = useCopyToClipboard(2000);

  return (
    <section
      aria-labelledby={`brick-${id}-title`}
      className="border-border border-t border-dashed pt-10"
    >
      <Tabs defaultValue="preview" variant="underline" className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id={`brick-${id}-title`}
              className="font-heading text-foreground text-lg leading-snug font-medium"
            >
              {name}
            </h2>
            <p className="text-muted-foreground mt-1 font-mono text-[13px]">{description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Tabs.List variant="underline" className="border-0">
              <Tabs.Trigger variant="underline" value="preview">
                Preview
              </Tabs.Trigger>
              <Tabs.Trigger variant="underline" value="code">
                Code
              </Tabs.Trigger>
            </Tabs.List>

            {/* Viewport toggles */}
            <div
              className="border-border hidden items-center gap-0.5 border-b border-dashed sm:flex"
              role="group"
              aria-label="Viewport size"
            >
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={cn(
                  'px-2 pb-3 transition-colors',
                  viewport === 'desktop'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-label="Desktop viewport"
                aria-pressed={viewport === 'desktop'}
              >
                <HugeiconsIcon icon={LaptopIcon} size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={cn(
                  'px-2 pb-3 transition-colors',
                  viewport === 'mobile'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-label="Mobile viewport"
                aria-pressed={viewport === 'mobile'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="12" height="20" x="6" y="2" rx="2" />
                  <circle cx="12" cy="18" r="1" />
                </svg>
              </button>
            </div>

            {installCommand && (
              <button
                type="button"
                onClick={() => copyToClipboard(installCommand)}
                aria-label={
                  isCopied ? 'Install command copied' : `Copy install command: ${installCommand}`
                }
                className={cn(
                  'border-border text-muted-foreground hover:text-foreground flex items-center gap-2 border-b pb-3 font-mono text-[12px] transition-colors',
                  isCopied && 'text-success',
                )}
                title={isCopied ? 'Copied!' : `Copy: ${installCommand}`}
              >
                <HugeiconsIcon
                  icon={isCopied ? Tick02Icon : Copy01Icon}
                  size={12}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">{installCommand}</span>
              </button>
            )}
          </div>
        </div>

        <Tabs.Content value="preview" className="mt-0">
          <div className="border-border bg-surface-muted border border-dashed">
            <div
              className={cn(
                'mx-auto flex min-h-[500px] items-center justify-center p-6 transition-all duration-300 sm:p-10',
                VIEWPORT_WIDTHS[viewport],
              )}
            >
              {children}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="code" className="mt-0">
          {files && files.length > 0 ? (
            <BrickCodeViewer files={files} />
          ) : (
            <div className="border-border border border-dashed p-6">
              <p className="text-destructive font-mono text-sm">
                ⚠ Source code not available for brick &ldquo;{name}&rdquo;.
              </p>
            </div>
          )}
        </Tabs.Content>
      </Tabs>
    </section>
  );
}
