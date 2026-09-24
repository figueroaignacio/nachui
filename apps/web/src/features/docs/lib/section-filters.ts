import type { DocSection } from '@/lib/definitions';
import { BookIcon } from '@repo/ui/icons/book';
import { GridIcon } from '@repo/ui/icons/grid';
import { LayersIcon } from '@repo/ui/icons/layers';
import { LayoutIcon } from '@repo/ui/icons/layout';
import { LayoutGridIcon } from '@repo/ui/icons/layout-grid';
import { RocketIcon } from '@repo/ui/icons/rocket';
import { WandIcon } from '@repo/ui/icons/wand';

export const ALL_SECTIONS = 'all';

export type SectionIcon = React.ComponentType<{ size?: number }>;

export interface SectionFilter {
  id: string;
  label: string;
  Icon: SectionIcon;
}

const ICON_BY_HREF: Record<string, SectionIcon> = {
  '/docs': RocketIcon,
  '/docs/installation': BookIcon,
  '/docs/elements/ui/': LayoutGridIcon,
  '/docs/elements/layout/': LayoutIcon,
  '/docs/elements/ai/': WandIcon,
  '/docs/elements/hybrids/': LayersIcon,
};

function iconOf(section: DocSection): SectionIcon {
  const first = section.items[0]?.href ?? '';
  const match = Object.keys(ICON_BY_HREF).find((prefix) =>
    prefix.endsWith('/') ? first.startsWith(prefix) : first === prefix,
  );
  return (match && ICON_BY_HREF[match]) || BookIcon;
}

function labelOf(section: DocSection, index: number): string {
  return index === 0 ? (section.items[0]?.title ?? section.title) : section.title;
}

export function sectionOf(sections: DocSection[], pathname: string): string {
  const exact = sections.find((section) => section.items.some((item) => item.href === pathname));
  if (exact) return exact.title;
  const byPrefix = sections.find((section) =>
    section.items.some((item) => item.href !== '/docs' && pathname.startsWith(`${item.href}/`)),
  );
  return byPrefix?.title ?? ALL_SECTIONS;
}

export function buildSectionFilters(sections: DocSection[], allLabel: string): SectionFilter[] {
  return [
    { id: ALL_SECTIONS, label: allLabel, Icon: GridIcon },
    ...sections.map((section, index) => ({
      id: section.title,
      label: labelOf(section, index),
      Icon: iconOf(section),
    })),
  ];
}

export function visibleSections(sections: DocSection[], filter: string): DocSection[] {
  return filter === ALL_SECTIONS
    ? sections
    : sections.filter((section) => section.title === filter);
}
