'use client';

import { Book02Icon, PuzzleIcon, ServerStack01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '../../components/badge';
import { NavigationMenu } from '../../components/navigation-menu';

const resources = [
  {
    icon: PuzzleIcon,
    title: 'Components',
    description: 'Free and open source, forever.',
    badge: { variant: 'success', label: 'Open source' },
  },
  {
    icon: Book02Icon,
    title: 'Changelog',
    description: '12 components shipped since v2.13.',
    badge: { variant: 'info', label: 'New' },
  },
  {
    icon: ServerStack01Icon,
    title: 'MCP server',
    description: 'Pull component source into your editor.',
    badge: { variant: 'warning', label: 'Beta' },
  },
] as const;

export function Badges() {
  return (
    <NavigationMenu className="min-h-64 items-start">
      <NavigationMenu.Item>
        <NavigationMenu.Trigger className="text-sm">Resources</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          {resources.map((resource) => (
            <NavigationMenu.Link
              key={resource.title}
              href="#"
              title={resource.title}
              description={resource.description}
              badge={<Badge variant={resource.badge.variant}>{resource.badge.label}</Badge>}
              icon={<HugeiconsIcon icon={resource.icon} size={16} strokeWidth={1.6} />}
            />
          ))}
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu>
  );
}
