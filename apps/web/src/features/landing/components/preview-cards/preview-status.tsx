import { Callout } from '@repo/ui/components/callout';
import { Card } from '@repo/ui/components/card';
import { Spinner } from '@repo/ui/components/spinner';

export function PreviewStatus() {
  return (
    <Card variant="outline" className="bg-card">
      <Card.Content compact className="flex flex-col gap-4 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Spinner size="sm" variant="primary" />
            <div className="text-foreground text-sm font-bold">Deploying to Edge...</div>
          </div>
          <div className="text-muted-foreground text-xs">45s</div>
        </div>
        <Callout variant="info" className="bg-info/10 text-info border-info/20 px-3 py-2.5 text-xs">
          <Callout.Title>Info</Callout.Title>
          <Callout.Content>
            Building serverless functions in region us-east-1. This usually takes around 2 minutes.
          </Callout.Content>
        </Callout>
      </Card.Content>
    </Card>
  );
}
