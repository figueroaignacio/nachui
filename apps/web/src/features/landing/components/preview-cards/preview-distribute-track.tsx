import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Empty } from '@repo/ui/components/empty';
import { IconTile } from '@repo/ui/components/icon-tile';

export function PreviewDistributeTrack() {
  return (
    <Card>
      <Card.Content compact className="py-6">
        <Empty className="gap-3 px-0 py-0">
          <Empty.Header className="gap-3">
            <Empty.Media className="mb-0">
              <IconTile radius="full" tone="muted" className="bg-muted text-lg">
                +
              </IconTile>
            </Empty.Media>
            <Empty.Title className="text-sm font-bold">Distribute Track</Empty.Title>
            <Empty.Description className="max-w-56 text-[11px] leading-relaxed">
              Upload your first master to start reaching listeners on every major platform.
            </Empty.Description>
          </Empty.Header>
          <Empty.Content>
            <Button size="sm" variant="secondary">
              Create Release
            </Button>
          </Empty.Content>
        </Empty>
      </Card.Content>
    </Card>
  );
}
