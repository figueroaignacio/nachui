import { Badge } from '@repo/ui/components/badge';
import { Card } from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';

export function PreviewBadges() {
  return (
    <Card variant="outline" className="bg-card backdrop-blur-sm">
      <Card.Content compact className="flex flex-col gap-3 pt-4">
        <div className="text-muted-foreground text-xs font-medium">Environment Status</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs">Production</span>
            <Badge variant="default">Stable</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-xs">Staging</span>
            <Badge variant="secondary">In Progress</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-xs">Development</span>
            <Badge variant="outline">Unstable</Badge>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
