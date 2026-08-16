'use client';

import { PuzzleIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '../../components/badge';
import { NavigationMenu } from '../../components/navigation-menu';

export function Badges() {
  return (
    <NavigationMenu className="min-h-64 items-start">
      <NavigationMenu.Item>
        <NavigationMenu.Trigger className="text-sm">Resources</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link
            href="#"
            title="Components"
            description="Free and open source, forever."
            badge={<Badge variant="success">Open source</Badge>}
            icon={<HugeiconsIcon icon={PuzzleIcon} size={16} strokeWidth={1.6} />}
          />
          <div className="flex cursor-default items-start gap-3 rounded-md px-2.5 py-2.5 opacity-60">
            <span className="border-border bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border border-dashed">
              <HugeiconsIcon icon={SparklesIcon} size={16} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-foreground text-sm font-medium">AI Elements</span>
                <Badge variant="outline">Soon</Badge>
              </span>
              <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                Chat, prompts and streaming primitives.
              </span>
            </span>
          </div>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu>
  );
}
