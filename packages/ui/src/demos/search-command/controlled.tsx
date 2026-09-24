'use client';

import { useState } from 'react';
import { SearchCommand, type SearchItem } from '../../hybrids/search-command';

const ITEMS: SearchItem[] = [
  { id: 'new', label: 'New file', group: 'Create', shortcut: ['N'] },
  { id: 'folder', label: 'New folder', group: 'Create' },
  { id: 'rename', label: 'Rename', group: 'Edit', shortcut: ['F2'] },
  { id: 'delete', label: 'Move to trash', group: 'Edit', shortcut: ['⌫'] },
  { id: 'share', label: 'Share link', group: 'Share' },
];

export function Controlled() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<SearchItem | null>(null);

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-border hover:bg-muted rounded-full border px-3 py-1.5 text-xs transition-colors"
      >
        Open command palette
      </button>
      <SearchCommand
        items={ITEMS}
        open={open}
        onOpenChange={setOpen}
        hotkey={null}
        onSelect={setLast}
        placeholder="Type a command…"
      >
        <SearchCommand.Dialog />
      </SearchCommand>
      <p className="text-muted-foreground text-xs">
        {last ? `Last: ${last.label}` : 'Nothing selected yet'}
      </p>
    </div>
  );
}
