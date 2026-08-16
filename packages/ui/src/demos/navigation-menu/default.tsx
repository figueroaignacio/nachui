'use client';

import { CodeIcon, PaintBoardIcon, PuzzleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { NavigationMenu } from '../../components/navigation-menu';

const products = [
  {
    icon: PuzzleIcon,
    title: 'Components',
    description: 'Accessible React primitives, ready to copy.',
    href: '#',
  },
  {
    icon: PaintBoardIcon,
    title: 'Themes',
    description: 'Design tokens for light and dark out of the box.',
    href: '#',
  },
  {
    icon: CodeIcon,
    title: 'CLI',
    description: 'Pull source files straight into your project.',
    href: '#',
  },
];

export function Default() {
  return (
    <NavigationMenu className="min-h-64 items-start">
      <NavigationMenu.Item>
        <NavigationMenu.Trigger className="text-sm">Products</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          {products.map((product) => (
            <NavigationMenu.Link
              key={product.title}
              href={product.href}
              title={product.title}
              description={product.description}
              icon={<HugeiconsIcon icon={product.icon} size={16} strokeWidth={1.6} />}
            />
          ))}
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
        Docs
      </a>
      <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
        Pricing
      </a>
    </NavigationMenu>
  );
}
