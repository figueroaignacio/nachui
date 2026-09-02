'use client';

import { HoverCard } from '../../components/hover-card';

export function LinkPreview() {
  return (
    <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
      The incident started after the{' '}
      <HoverCard openDelay={200}>
        <HoverCard.Trigger asChild>
          <a
            href="#"
            className="text-foreground font-medium underline underline-offset-4"
            onClick={(event) => event.preventDefault()}
          >
            v2.24.0 release
          </a>
        </HoverCard.Trigger>
        <HoverCard.Content side="top" align="start" className="w-64 p-0">
          <div className="bg-muted h-24 rounded-t-md" />
          <div className="flex flex-col gap-1 p-3">
            <p className="text-sm font-medium">Release v2.24.0</p>
            <p className="text-muted-foreground text-xs">
              Connection pooling for the EU region, new webhook retries, and 14 fixes.
            </p>
            <p className="text-muted-foreground text-xs">github.com/northwind/api</p>
          </div>
        </HoverCard.Content>
      </HoverCard>{' '}
      rolled out to the EU region, and was resolved by rolling back the pooling change.
    </p>
  );
}
