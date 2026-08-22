import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';
import { Stack } from '../../layout/stack';

export function Destructive() {
  return (
    <Stack
      gap="3"
      className="border-destructive-border bg-destructive-surface w-full max-w-sm rounded-xl border p-4"
    >
      <div>
        <p className="text-destructive-text text-sm font-medium">Delete billing account</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Removes 3 projects and every invoice from March 2024 onward. This cannot be undone.
        </p>
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="self-start"
        leftIcon={<HugeiconsIcon icon={Delete02Icon} className="size-4" size={16} />}
      >
        Delete account
      </Button>
    </Stack>
  );
}
