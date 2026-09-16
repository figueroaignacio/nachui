'use client';

import { ContextMenu } from '../../components/context-menu';
import { DownloadIcon } from '../../icons/download';
import { LinkIcon } from '../../icons/link';
import { PlusIcon } from '../../icons/plus';
import { TrashIcon } from '../../icons/trash';

const tracks = [
  { title: 'Design tokens walkthrough', duration: '12:40' },
  { title: 'Building the registry pipeline', duration: '18:03' },
  { title: 'Dark mode without flicker', duration: '09:27' },
];

export function TrackList() {
  return (
    <div className="border-border bg-card w-full max-w-sm divide-y rounded-xl border">
      {tracks.map((track, index) => (
        <ContextMenu key={track.title}>
          <ContextMenu.Trigger className="hover:bg-muted flex cursor-default items-center justify-between gap-3 px-4 py-3 transition-colors first:rounded-t-xl last:rounded-b-xl">
            <span className="flex min-w-0 items-center gap-3">
              <span className="text-muted-foreground w-4 shrink-0 font-mono text-xs">
                {index + 1}
              </span>
              <span className="truncate text-sm">{track.title}</span>
            </span>
            <span className="text-muted-foreground shrink-0 font-mono text-xs">
              {track.duration}
            </span>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>
              <PlusIcon size={16} />
              Add to queue
            </ContextMenu.Item>
            <ContextMenu.Item>
              <LinkIcon size={16} />
              Copy link
            </ContextMenu.Item>
            <ContextMenu.Item>
              <DownloadIcon size={16} />
              Download
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item variant="destructive">
              <TrashIcon size={16} />
              Remove
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      ))}
    </div>
  );
}
