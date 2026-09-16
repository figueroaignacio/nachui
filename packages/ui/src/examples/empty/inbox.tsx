import { Button } from '../../components/button';
import { Empty } from '../../components/empty';
import { Kbd } from '../../components/kbd';
import { InboxIcon } from '../../icons/inbox';

export function Inbox() {
  return (
    <Empty variant="card" className="max-w-md">
      <Empty.Header>
        <Empty.Media variant="icon">
          <InboxIcon size={24} />
        </Empty.Media>
        <Empty.Title>Inbox zero</Empty.Title>
        <Empty.Description>
          Every notification is handled. New mentions, reviews and deploy alerts will land here.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button size="sm" variant="outline">
          Notification settings
        </Button>
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          or press <Kbd>R</Kbd> to refresh
        </span>
      </Empty.Content>
    </Empty>
  );
}
