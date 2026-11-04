import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Empty } from '@repo/ui/components/empty';

export function PreviewEmpty() {
  return (
    <Card>
      <Card.Content compact>
        <Empty className="p-4">
          <Empty.Header>
            <Empty.Title className="text-sm">No projects yet</Empty.Title>
            <Empty.Description className="text-xs">
              Create one to start inviting your team.
            </Empty.Description>
          </Empty.Header>
          <Empty.Content>
            <Button size="sm" variant="outline">
              New project
            </Button>
          </Empty.Content>
        </Empty>
      </Card.Content>
    </Card>
  );
}
