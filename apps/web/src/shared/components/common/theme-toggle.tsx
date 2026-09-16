'use client';

import { Button } from '@repo/ui/components/button';
import { MoonIcon } from '@repo/ui/icons/moon';
import { SunIcon } from '@repo/ui/icons/sun';
import { useTheme } from 'nach-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark', e)}
      className="text-muted-foreground hover:text-foreground size-8"
      aria-label="Toggle theme"
    >
      {/* Both icons render; the active theme decides which one shows, so server and client markup match. */}
      <span className="dark:hidden">
        <SunIcon size={16} aria-hidden="true" />
      </span>
      <span className="hidden dark:block">
        <MoonIcon size={16} aria-hidden="true" />
      </span>
    </Button>
  );
}
