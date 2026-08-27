import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Frame } from '../../components/frame';

export function Default() {
  return (
    <Frame className="max-w-md">
      <Frame.Header>
        <Frame.Title>Workspace</Frame.Title>
        <Frame.Description>Plan and usage for the acme team.</Frame.Description>
      </Frame.Header>
      <Frame.Panel>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pro plan</span>
            <Badge variant="success">Active</Badge>
          </div>
          <Card variant="outline">
            <Card.Header compact>
              <Card.Title>Monthly usage</Card.Title>
              <Card.Description>4,210 of 10,000 requests</Card.Description>
            </Card.Header>
            <Card.Content compact>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div className="bg-primary h-full w-2/5 rounded-full" />
              </div>
            </Card.Content>
          </Card>
        </div>
      </Frame.Panel>
      <Frame.Footer className="justify-end">
        <Button size="sm" variant="ghost">
          Invoices
        </Button>
        <Button size="sm" variant="outline">
          Manage plan
        </Button>
      </Frame.Footer>
    </Frame>
  );
}
