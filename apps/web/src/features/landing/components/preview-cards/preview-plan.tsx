import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Tabs } from '@repo/ui/components/tabs';

export function PreviewPlan() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Choose a plan</Card.Title>
        <Card.Description className="text-xs">Change or cancel any time.</Card.Description>
      </Card.Header>
      <Card.Content compact>
        <Tabs defaultValue="monthly" size="sm">
          <Tabs.List className="w-full sm:w-full">
            <Tabs.Trigger value="monthly" className="flex-1">
              Monthly
            </Tabs.Trigger>
            <Tabs.Trigger value="yearly" className="flex-1">
              Yearly
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs>
        <p className="font-heading text-foreground mt-5 text-3xl font-bold tracking-tight">
          $24
          <span className="text-muted-foreground ml-1 font-sans text-xs font-normal tracking-normal">
            per seat
          </span>
        </p>
      </Card.Content>
      <Card.Footer compact>
        <Button size="sm" fullWidth>
          Upgrade to Team
        </Button>
      </Card.Footer>
    </Card>
  );
}
