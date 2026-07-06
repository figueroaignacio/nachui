import { Typography } from '@repo/ui/components/typography';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';

export function PreviewSchema() {
  return (
    <Card variant="outline" className="bg-card">
      <Card.Content compact className="pt-5 pb-5">
        <div className="bg-destructive/20 text-destructive mb-3 flex size-8 items-center justify-center rounded-full">
          <span className="font-bold">!</span>
        </div>
        <Typography variant="h4" className="text-foreground text-sm font-bold">
          Unsaved Schema Changes
        </Typography>
        <Typography variant="p" className="text-muted-foreground mt-1 mb-4 text-xs">
          These database migrations have not been applied yet.
        </Typography>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-background text-foreground flex-1">
            Review
          </Button>
          <Button variant="destructive" size="sm" className="flex-1">
            Force Apply
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}
