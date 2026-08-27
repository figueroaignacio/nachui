'use client';

import {
  CopyIcon,
  Delete02Icon,
  Download01Icon,
  PencilEdit01Icon,
  Share01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { ContextMenu } from '../../components/context-menu';

export function Default() {
  return (
    <ContextMenu className="w-full max-w-md">
      <ContextMenu.Trigger className="border-border text-muted-foreground flex h-48 w-full items-center justify-center rounded-xl border border-dashed text-sm">
        Right click here
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Label>report-q3.pdf</ContextMenu.Label>
        <ContextMenu.Separator />
        <ContextMenu.Item>
          <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
          Rename
          <ContextMenu.Shortcut>F2</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <HugeiconsIcon icon={CopyIcon} size={16} />
          Copy
          <ContextMenu.Shortcut>Ctrl C</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <HugeiconsIcon icon={Download01Icon} size={16} />
          Download
        </ContextMenu.Item>
        <ContextMenu.Item disabled>
          <HugeiconsIcon icon={Share01Icon} size={16} />
          Share
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item variant="destructive">
          <HugeiconsIcon icon={Delete02Icon} size={16} />
          Delete
          <ContextMenu.Shortcut>Del</ContextMenu.Shortcut>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
