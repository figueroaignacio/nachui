import { Button } from '../../components/button';
import { DownloadIcon } from '../../icons/download';
import { LinkIcon } from '../../icons/link';
import { PencilIcon } from '../../icons/pencil';
import { ShareIcon } from '../../icons/share';
import { TrashIcon } from '../../icons/trash';

export function Toolbar() {
  return (
    <div className="border-border bg-card flex w-full max-w-lg flex-wrap items-center gap-2 rounded-xl border p-2">
      <Button size="sm" variant="ghost" leftIcon={<PencilIcon size={16} />}>
        Edit
      </Button>
      <Button size="sm" variant="ghost" leftIcon={<LinkIcon size={16} />}>
        Copy link
      </Button>
      <Button size="sm" variant="ghost" leftIcon={<DownloadIcon size={16} />}>
        Export
      </Button>
      <span className="bg-border mx-1 hidden h-5 w-px sm:block" aria-hidden="true" />
      <Button
        size="sm"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        leftIcon={<TrashIcon size={16} />}
      >
        Delete
      </Button>
      <Button size="sm" className="ml-auto" leftIcon={<ShareIcon size={16} />}>
        Publish
      </Button>
    </div>
  );
}
