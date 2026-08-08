'use client';

import { useCopyToClipboard } from '@/features/docs/hooks/use-copy-to-clipboard';
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard(2000);

  return (
    <button
      onClick={() => copyToClipboard(value)}
      disabled={isCopied}
      title={isCopied ? 'Copied!' : 'Copy code'}
      aria-label={isCopied ? 'Copied!' : 'Copy code'}
      className={cn(
        'text-muted-foreground hover:text-foreground transition-all duration-100 hover:scale-[1.05] hover:cursor-pointer active:scale-[0.90]',
        className,
      )}
    >
      {isCopied ? (
        <HugeiconsIcon icon={Tick02Icon} className="h-4 w-4" aria-hidden="true" />
      ) : (
        <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
