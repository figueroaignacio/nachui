import { COMPONENT_FAMILY } from '@repo/ui/registry';
import type * as React from 'react';
import { EXAMPLE_COMPONENTS } from './example-registry';

export interface GalleryExample {
  name: string;
  label: string;
  Demo: React.ComponentType;
}

export interface GalleryComponent {
  slug: string;
  docsHref: string;
  examples: GalleryExample[];
  Preview: React.ComponentType;
}

const FLOATING_SLUGS = new Set([
  'command',
  'context-menu',
  'dropdown-menu',
  'navigation-menu',
  'popover',
  'select',
  'tooltip',
]);

export function isFloating(slug: string): boolean {
  return FLOATING_SLUGS.has(slug);
}

export function humanize(name: string): string {
  const words = name.split('-').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function getGalleryComponents(): GalleryComponent[] {
  return Object.entries(EXAMPLE_COMPONENTS).map(([slug, demos]) => {
    const family = (COMPONENT_FAMILY as Record<string, string>)[slug] ?? 'ui';
    const examples = Object.keys(demos)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name, label: humanize(name), Demo: demos[name] as React.ComponentType }));

    return {
      slug,
      docsHref: `/docs/elements/${family}/${slug}`,
      examples,
      Preview: (examples[0] as GalleryExample).Demo,
    };
  });
}

export function getGalleryComponent(slug: string): GalleryComponent | undefined {
  return getGalleryComponents().find((entry) => entry.slug === slug);
}

export function getAllGallerySlugs(): string[] {
  return Object.keys(EXAMPLE_COMPONENTS);
}

export function countGalleryExamples(): number {
  return Object.values(EXAMPLE_COMPONENTS).reduce(
    (total, demos) => total + Object.keys(demos).length,
    0,
  );
}
