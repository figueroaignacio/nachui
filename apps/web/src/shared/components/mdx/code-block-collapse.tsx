'use client';

import { Button } from '@repo/ui/components/button';
import { cn } from '@repo/ui/lib/cn';
import { useState } from 'react';

interface CodeBlockCollapseProps {
  expandLabel: string;
  collapseLabel: string;
  children: React.ReactNode;
}

/**
 * The only stateful part of a code block. The highlighted markup arrives as
 * children, already rendered on the server, so expanding never re-tokenizes.
 */
export function CodeBlockCollapse({
  expandLabel,
  collapseLabel,
  children,
}: CodeBlockCollapseProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div
        className={cn(
          'transition-[max-height] duration-400 ease-out motion-reduce:transition-none',
          isExpanded ? 'max-h-128 overflow-y-auto' : 'max-h-52 overflow-y-hidden',
        )}
      >
        {children}
      </div>
      {isExpanded ? (
        <div className="border-rule flex justify-center border-t py-2">
          <ExpandButton onClick={() => setIsExpanded(false)}>{collapseLabel}</ExpandButton>
        </div>
      ) : (
        <div className="from-code via-code absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t to-transparent pt-16 pb-3">
          <ExpandButton onClick={() => setIsExpanded(true)}>{expandLabel}</ExpandButton>
        </div>
      )}
    </>
  );
}

function ExpandButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-7 rounded-sm font-mono"
    >
      {children}
    </Button>
  );
}
