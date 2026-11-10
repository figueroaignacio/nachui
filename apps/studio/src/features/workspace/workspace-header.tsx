'use client';

import { Button } from '@repo/ui/components/button';
import { DropdownMenu } from '@repo/ui/components/dropdown-menu';
import { Sidebar } from '@repo/ui/components/sidebar';
import { ChevronDownIcon } from '@repo/ui/icons/chevron-down';
import { UploadIcon } from '@repo/ui/icons/upload';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import type { VersionSummary } from '@/lib/types';

function ProjectName({ name, onRename }: { name: string; onRename?: (name: string) => void }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  if (!onRename) return <span className="min-w-0 truncate px-1 text-sm font-medium">{name}</span>;

  if (editing) {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const value = draft.trim();
          if (value && value !== name) onRename(value);
          setEditing(false);
        }}
      >
        <input
          ref={inputRef}
          aria-label="Project name"
          value={draft}
          maxLength={80}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setEditing(false);
          }}
          className="border-input bg-card focus-visible:ring-ring h-8 w-56 rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(name);
        setEditing(true);
      }}
      title="Rename"
      className="hover:bg-muted focus-visible:ring-ring max-w-56 min-w-0 truncate rounded-md px-2 py-1 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
    >
      {name}
    </button>
  );
}

export function WorkspaceHeader({
  name,
  version,
  versions,
  onRename,
  onRestore,
  sidebar = true,
  end,
}: {
  name: string;
  version: number;
  versions: VersionSummary[];
  onRename?: (name: string) => void;
  onRestore?: (version: number) => void;
  sidebar?: boolean;
  end?: React.ReactNode;
}) {
  return (
    <header className="border-border flex h-12 shrink-0 items-center gap-1.5 border-b px-2 sm:px-3">
      {sidebar ? (
        <Sidebar.Trigger className="max-md:size-10" />
      ) : (
        <Link
          href="/"
          aria-label="Studio home"
          className="focus-visible:ring-ring me-1 shrink-0 rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <Image src="/icon-192.png" alt="" width={24} height={24} className="rounded-md" />
        </Link>
      )}
      <ProjectName key={name} name={name} onRename={onRename} />
      {version > 0 ? (
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-6 shrink-0 gap-1 rounded-full px-2 font-mono text-[11px]"
              rightIcon={<ChevronDownIcon size={11} />}
            >
              v{version}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start" className="w-72">
            <DropdownMenu.Label>Versions</DropdownMenu.Label>
            {[...versions].reverse().map((item) => (
              <DropdownMenu.Item
                key={item.number}
                disabled={!onRestore || item.number === version}
                onSelect={() => onRestore?.(item.number)}
                className="flex items-start gap-2"
              >
                <span className="text-muted-foreground w-8 shrink-0 font-mono text-xs leading-5">
                  v{item.number}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {item.summary ?? 'Version'}
                  {item.number === version ? (
                    <span className="text-muted-foreground"> · current</span>
                  ) : null}
                </span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
      ) : null}
      <span className="min-w-2 flex-1" />
      {end}
    </header>
  );
}

export function ExportButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <Button size="sm" onClick={onClick} disabled={disabled} leftIcon={<UploadIcon size={14} />}>
      Export
    </Button>
  );
}
