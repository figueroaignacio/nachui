'use client';

import { useDocsNavigation } from '@/features/docs/hooks/use-docs-navigation';
import { Link } from '@/i18n/navigation';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { cn } from '@repo/ui/lib/cn';

type DocsNavigationButtonsProps = {
  currentPath: string;
};

type NavIconButtonProps = {
  href?: string;
  label: string;
  icon: typeof ArrowLeft01Icon;
  disabled?: boolean;
  className?: string;
};

function NavIconButton({ href, label, icon, disabled, className }: NavIconButtonProps) {
  if (disabled || !href) {
    return (
      <Button
        disabled
        size="icon"
        variant="outline"
        aria-label={label}
        className={cn('h-8 w-8', className)}
      >
        <HugeiconsIcon icon={icon} className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Link href={href} aria-label={label}>
      <Button size="icon" variant="outline" className={cn('h-8 w-8', className)}>
        <HugeiconsIcon icon={icon} className="h-4 w-4" />
      </Button>
    </Link>
  );
}

export function DocsNavigationButtons({ currentPath }: DocsNavigationButtonsProps) {
  const { prev, next } = useDocsNavigation(currentPath);

  return (
    <div className="hidden items-center gap-1 md:flex">
      <NavIconButton
        href={prev?.href}
        label={prev ? `Previous: ${prev.title}` : 'No previous page'}
        icon={ArrowLeft01Icon}
        disabled={!prev}
        className="rounded-md"
      />
      <NavIconButton
        href={next?.href}
        label={next ? `Next: ${next.title}` : 'No next page'}
        icon={ArrowRight01Icon}
        disabled={!next}
        className="rounded-md"
      />
    </div>
  );
}
