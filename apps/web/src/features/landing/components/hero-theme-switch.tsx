'use client';

import { useSyncExternalStore } from 'react';
import { Switch } from '@repo/ui/components/switch';
import { useTheme } from 'nach-themes';

const subscribe = () => () => {};

interface HeroThemeSwitchProps {
  label: string;
}

/** The real switch, sized to sit in the headline and wired to the site theme. */
export function HeroThemeSwitch({ label }: HeroThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const dark = mounted && resolvedTheme === 'dark';

  return (
    <span className="hero-switch">
      <Switch
        aria-label={label}
        checked={dark}
        onClick={(event) =>
          setTheme(dark ? 'light' : 'dark', event.clientX > 0 ? event : undefined)
        }
      />
    </span>
  );
}
