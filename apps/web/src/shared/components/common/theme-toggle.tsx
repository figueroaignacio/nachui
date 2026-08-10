'use client';

import { Moon02Icon, SunIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'nach-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={(e) => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark', e)}
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex items-center justify-center rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label="Toggle theme"
    >
      {/* Both icons render; the active theme decides which one shows, so server and client markup match. */}
      <span className="dark:hidden">
        <HugeiconsIcon icon={SunIcon} size={16} aria-hidden="true" />
      </span>
      <span className="hidden dark:block">
        <HugeiconsIcon icon={Moon02Icon} size={16} aria-hidden="true" />
      </span>
    </button>
  );
}
