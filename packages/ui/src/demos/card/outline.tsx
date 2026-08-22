import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Card } from '../../components/card';

export function Outline() {
  return (
    <Card variant="outline" className="w-full max-w-sm">
      <Card.Header>
        <div className="flex items-center justify-between gap-3">
          <Card.Title>ci-deploy-key</Card.Title>
          <Badge variant="outline">Read and write</Badge>
        </div>
        <Card.Description>Created Jan 9, last used 3 hours ago</Card.Description>
      </Card.Header>
      <Card.Content className="text-sm">
        <code className="bg-muted text-muted-foreground block truncate rounded px-2 py-1.5 font-mono text-xs">
          sk_live_4f8a...c210
        </code>
      </Card.Content>
      <Card.Footer align="between">
        <Button variant="ghost" size="sm">
          Copy
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive-text">
          Revoke
        </Button>
      </Card.Footer>
    </Card>
  );
}
