import {
  Delete02Icon,
  Download01Icon,
  Link01Icon,
  PencilEdit01Icon,
  Share01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';

export function Toolbar() {
  return (
    <div className="border-border bg-card flex w-full max-w-lg flex-wrap items-center gap-2 rounded-xl border p-2">
      <Button
        size="sm"
        variant="ghost"
        leftIcon={<HugeiconsIcon icon={PencilEdit01Icon} size={16} />}
      >
        Edit
      </Button>
      <Button size="sm" variant="ghost" leftIcon={<HugeiconsIcon icon={Link01Icon} size={16} />}>
        Copy link
      </Button>
      <Button
        size="sm"
        variant="ghost"
        leftIcon={<HugeiconsIcon icon={Download01Icon} size={16} />}
      >
        Export
      </Button>
      <span className="bg-border mx-1 hidden h-5 w-px sm:block" aria-hidden="true" />
      <Button
        size="sm"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        leftIcon={<HugeiconsIcon icon={Delete02Icon} size={16} />}
      >
        Delete
      </Button>
      <Button
        size="sm"
        className="ml-auto"
        leftIcon={<HugeiconsIcon icon={Share01Icon} size={16} />}
      >
        Publish
      </Button>
    </div>
  );
}
