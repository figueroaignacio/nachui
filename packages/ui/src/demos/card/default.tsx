import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Card } from '../../components/card';

export function Default() {
  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <div className="flex items-center justify-between gap-3">
          <Card.Title>Production deploy</Card.Title>
          <Badge variant="success">Live</Badge>
        </div>
        <Card.Description>web-app, commit 8f2c1ad on main</Card.Description>
      </Card.Header>
      <Card.Content className="text-sm">
        <dl className="grid grid-cols-2 gap-y-2">
          <dt className="text-muted-foreground">Build time</dt>
          <dd className="text-right">42s</dd>
          <dt className="text-muted-foreground">Triggered by</dt>
          <dd className="text-right">lucia@acmestudio.dev</dd>
          <dt className="text-muted-foreground">Finished</dt>
          <dd className="text-right">12 minutes ago</dd>
        </dl>
      </Card.Content>
      <Card.Footer align="between">
        <Button variant="ghost" size="sm">
          Roll back
        </Button>
        <Button variant="secondary" size="sm">
          View logs
        </Button>
      </Card.Footer>
    </Card>
  );
}
