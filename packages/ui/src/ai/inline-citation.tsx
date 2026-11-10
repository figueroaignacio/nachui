'use client';

import * as React from 'react';
import { HoverCard } from '../components/hover-card';
import { cn } from '../lib/cn';

interface InlineCitationSource {
  url: string;
  title: string;
  description?: string;
}

interface InlineCitationProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  sources: InlineCitationSource[];
  children?: React.ReactNode;
  label?: string;
  sourcesLabel?: (count: number) => string;
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const InlineCitation = ({
  className,
  sources,
  children,
  label,
  sourcesLabel = (count) => (count === 1 ? '1 source' : `${count} sources`),
  ref,
  ...props
}: InlineCitationProps & { ref?: React.Ref<HTMLSpanElement> }) => {
  const first = sources[0];
  if (!first) return children ? <>{children}</> : null;

  const extra = sources.length - 1;
  const chip = label ?? `${hostname(first.url)}${extra > 0 ? ` +${extra}` : ''}`;

  return (
    <span ref={ref} data-slot="inline-citation" className={cn('inline', className)} {...props}>
      {children ? (
        <span
          data-slot="inline-citation-text"
          className="decoration-border-interactive underline decoration-dotted underline-offset-4"
        >
          {children}
        </span>
      ) : null}
      {children ? ' ' : null}
      <HoverCard openDelay={150} closeDelay={150}>
        <HoverCard.Trigger asChild>
          <button
            type="button"
            aria-label={`${chip}, ${sourcesLabel(sources.length)}`}
            data-slot="inline-citation-trigger"
            className="bg-muted text-muted-strong hover:bg-secondary hover:text-foreground focus-visible:ring-ring inline-flex h-5 items-center rounded-sm px-1.5 align-[0.1em] text-[11px] leading-none font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {chip}
          </button>
        </HoverCard.Trigger>
        <HoverCard.Content className="w-72 p-1">
          <ul data-slot="inline-citation-sources" className="flex flex-col">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:bg-muted focus-visible:bg-muted flex flex-col gap-0.5 rounded-sm px-2 py-1.5 outline-none"
                >
                  <span className="text-muted-foreground truncate text-[11px]">
                    {hostname(source.url)}
                  </span>
                  <span className="text-foreground text-sm font-medium">{source.title}</span>
                  {source.description ? (
                    <span className="text-muted-foreground line-clamp-2 text-xs">
                      {source.description}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </HoverCard.Content>
      </HoverCard>
    </span>
  );
};

InlineCitation.displayName = 'InlineCitation';

export { InlineCitation };
export type { InlineCitationProps, InlineCitationSource };
