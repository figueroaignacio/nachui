import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';

const changes = [
  { file: 'apps/web', detail: '+412 −118' },
  { file: 'packages/ui', detail: '+1,904 −7' },
];

export function PreviewDeployReview() {
  return (
    <Card>
      <Card.Header compact>
        <div className="flex items-start justify-between gap-2">
          <div>
            <Card.Title className="text-sm font-semibold">Ship to production</Card.Title>
            <Card.Description className="text-xs">main · 8f2c1ad</Card.Description>
          </div>
          <Badge variant="success" className="text-[10px]">
            Checks passed
          </Badge>
        </div>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-3">
        <div className="bg-surface-muted space-y-2.5 rounded-md p-3.5 text-xs">
          {changes.map((change) => (
            <div key={change.file} className="flex justify-between">
              <span className="text-muted-foreground font-mono">{change.file}</span>
              <span className="text-foreground font-mono font-semibold">{change.detail}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rollback window</span>
            <span className="text-foreground font-semibold">30 minutes</span>
          </div>
        </div>
      </Card.Content>
      <Card.Footer compact className="mt-2 flex-col gap-2">
        <Button size="sm" fullWidth>
          Deploy 2 packages
        </Button>
        <div className="flex w-full gap-2">
          <Button size="sm" variant="outline" fullWidth>
            Preview
          </Button>
          <Button size="sm" variant="ghost" fullWidth className="text-destructive-text">
            Cancel
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}
