import { Button } from '../../components/button';
import { InboxIcon } from '../../icons/inbox';
import { Center } from '../../layout/center';

export function Default() {
  return (
    <Center
      text
      className="border-border bg-card h-56 w-full max-w-md flex-col gap-3 rounded-xl border"
    >
      <span className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
        <InboxIcon size={20} />
      </span>
      <div>
        <p className="text-sm font-medium">No deploys yet</p>
        <p className="text-muted-foreground text-xs">Push to main to trigger the first one.</p>
      </div>
      <Button size="sm" variant="outline">
        View setup guide
      </Button>
    </Center>
  );
}
