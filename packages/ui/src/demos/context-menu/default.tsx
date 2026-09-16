'use client';

import { ContextMenu } from '../../components/context-menu';
import { CopyIcon } from '../../icons/copy';
import { DownloadIcon } from '../../icons/download';
import { PencilIcon } from '../../icons/pencil';
import { ShareIcon } from '../../icons/share';
import { TrashIcon } from '../../icons/trash';

export function Default() {
  return (
    <ContextMenu className="w-full max-w-md">
      <ContextMenu.Trigger className="border-border bg-hatch text-muted-foreground flex h-48 w-full items-center justify-center rounded-xl border text-sm">
        Right click here
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Label>report-q3.pdf</ContextMenu.Label>
        <ContextMenu.Separator />
        <ContextMenu.Item>
          <PencilIcon size={16} />
          Rename
          <ContextMenu.Shortcut>F2</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <CopyIcon size={16} />
          Copy
          <ContextMenu.Shortcut>Ctrl C</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <DownloadIcon size={16} />
          Download
        </ContextMenu.Item>
        <ContextMenu.Item disabled>
          <ShareIcon size={16} />
          Share
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item variant="destructive">
          <TrashIcon size={16} />
          Delete
          <ContextMenu.Shortcut>Del</ContextMenu.Shortcut>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
