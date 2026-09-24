'use client';

import { useState } from 'react';
import { SearchCommand, type SearchItem } from '../../hybrids/search-command';

function Glyph({ d }: { d: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  home: 'M3 11 12 3l9 8v10H3z',
  file: 'M6 3h8l4 4v14H6z M14 3v4h4',
  box: 'M4 7l8-4 8 4v10l-8 4-8-4z M4 7l8 4 8-4 M12 11v10',
  moon: 'M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z',
  user: 'M20 21a8 8 0 0 0-16 0 M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
};

export function Default() {
  const [last, setLast] = useState<string | null>(null);

  const items: SearchItem[] = [
    {
      id: 'home',
      label: 'Home',
      group: 'Pages',
      icon: <Glyph d={ICONS.home} />,
      shortcut: ['G', 'H'],
    },
    {
      id: 'docs',
      label: 'Documentation',
      group: 'Pages',
      icon: <Glyph d={ICONS.file} />,
      shortcut: ['G', 'D'],
    },
    {
      id: 'icons',
      label: 'Icons',
      group: 'Pages',
      icon: <Glyph d={ICONS.box} />,
      keywords: ['svg', 'glyph'],
    },
    {
      id: 'button',
      label: 'Button',
      group: 'Components',
      description: 'Actions, in five variants',
      icon: <Glyph d={ICONS.box} />,
    },
    {
      id: 'dialog',
      label: 'Dialog',
      group: 'Components',
      description: 'A modal with focus trapped',
      icon: <Glyph d={ICONS.box} />,
    },
    {
      id: 'chat',
      label: 'Chat',
      group: 'Components',
      description: 'The whole thread in one piece',
      icon: <Glyph d={ICONS.box} />,
      keywords: ['ai', 'hybrid'],
    },
    {
      id: 'theme',
      label: 'Toggle theme',
      group: 'Actions',
      icon: <Glyph d={ICONS.moon} />,
      shortcut: ['T'],
    },
    { id: 'profile', label: 'Open profile', group: 'Actions', icon: <Glyph d={ICONS.user} /> },
    {
      id: 'signout',
      label: 'Sign out',
      group: 'Actions',
      icon: <Glyph d={ICONS.user} />,
      disabled: true,
    },
  ];

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SearchCommand
        items={items}
        placeholder="Search docs, components, actions…"
        onSelect={(item) => setLast(item.label)}
      />
      <p className="text-muted-foreground text-xs">
        {last ? `Selected ${last}` : 'Press ⌘K or click the field'}
      </p>
    </div>
  );
}
