import { ArrowDown02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getTranslations } from 'next-intl/server';

export async function SkipLink() {
  let label: string;

  try {
    const t = await getTranslations('components.skipLink');
    label = t('label');
  } catch {
    return null;
  }

  if (label === 'skipLink' || label === 'ui.skipLink') {
    label = 'Skip to main content';
  }

  return (
    <a
      href="#main-content"
      className="bg-background/80 border-border/50 text-foreground fixed top-0 left-1/2 z-9999 flex -translate-x-1/2 -translate-y-[150%] items-center gap-2 rounded-b-xl border border-t-0 px-4 py-3 text-sm font-semibold tracking-tight shadow-2xl backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:translate-y-0 focus-visible:outline-none"
    >
      <div className="bg-primary/20 text-primary flex items-center justify-center rounded-full p-1.5">
        <HugeiconsIcon icon={ArrowDown02Icon} size={16} aria-hidden="true" />
      </div>
      {label}
    </a>
  );
}
