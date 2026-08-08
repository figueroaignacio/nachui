'use client';

import { Link } from '@/i18n/navigation';
import { LinkSquare02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Typography } from '@repo/ui/components/typography';
import { COMPONENT_LIST_PREVIEWS } from './component-list-previews';
import { DEMO_COMPONENTS } from './demo-registry';

interface ComponentCardProps {
  label: string;
  href: string;
  description?: string;
}

export function ComponentCard({ label, href, description }: ComponentCardProps) {
  const componentName = href.split('/').pop() || '';

  const PreviewComponent =
    COMPONENT_LIST_PREVIEWS[componentName] || DEMO_COMPONENTS[componentName]?.default;

  return (
    <div className="group relative">
      {/* Overlay link keeps interactive elements in the preview out of the anchor's DOM subtree. */}
      <Link href={href} className="absolute inset-0 z-20 rounded-xl" aria-label={label} />
      <div className="border-border flex flex-col gap-3 overflow-hidden rounded-xl border transition-all duration-200 group-active:scale-[0.98]">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 z-0 mask-[linear-gradient(to_bottom,white,transparent)] opacity-[0.03] dark:opacity-[0.07]">
            <div className="absolute h-full w-full bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]" />
          </div>
          <div
            inert
            className="pointer-events-none z-10 scale-90 transition-transform duration-300 select-none group-hover:scale-100 sm:scale-100"
          >
            {PreviewComponent ? (
              <PreviewComponent />
            ) : (
              <div className="text-muted-foreground/50 text-xs font-medium tracking-widest uppercase">
                Preview Not Available
              </div>
            )}
          </div>
        </div>
        <div className="border-border bg-secondary/50 flex justify-between border-t border-dashed px-4 py-12">
          <div>
            <Typography variant="h3" className="font-heading font-semibold tracking-tight">
              {label}
            </Typography>
            {description && (
              <Typography
                variant="p"
                className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed"
              >
                {description}
              </Typography>
            )}
          </div>
          <div>
            <HugeiconsIcon icon={LinkSquare02Icon} />
          </div>
        </div>
      </div>
    </div>
  );
}
