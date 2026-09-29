import { Card } from '@repo/ui/components/card';
import { Center } from '@repo/ui/layout/center';
import { Grid } from '@repo/ui/layout/grid';
import { Split } from '@repo/ui/layout/split';
import { Stack } from '@repo/ui/layout/stack';
import { cn } from '@repo/ui/lib/cn';

function Block({ accent, className }: { accent?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        'bg-foreground/10 border-foreground/15 h-4 rounded-sm border',
        accent && 'border-brand bg-brand/15',
        className,
      )}
    />
  );
}

function LayoutCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">{title}</Card.Title>
        <Card.Description className="text-xs">{description}</Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4">
        <div className="border-foreground/20 rounded-md border border-dashed p-2.5">{children}</div>
      </Card.Content>
    </Card>
  );
}

export function PreviewLayoutStack() {
  return (
    <LayoutCard title="Stack" description="One direction, one gap.">
      <Stack gap="2">
        <Block />
        <Block />
        <Block accent className="w-3/5" />
      </Stack>
    </LayoutCard>
  );
}

export function PreviewLayoutGrid() {
  return (
    <LayoutCard title="Grid" description="Equal tracks that wrap.">
      <Grid columns="3" gap="2">
        <Block className="h-7" />
        <Block className="h-7" />
        <Block className="h-7" />
        <Block className="h-7" />
        <Block accent className="h-7" />
        <Block className="h-7" />
      </Grid>
    </LayoutCard>
  );
}

export function PreviewLayoutSplit() {
  return (
    <LayoutCard title="Split" description="Two panes with a ratio.">
      <Split ratio="1/3" collapse="none" gap="2">
        <Block className="h-14" />
        <Block accent className="h-14" />
      </Split>
    </LayoutCard>
  );
}

export function PreviewLayoutCenter() {
  return (
    <LayoutCard title="Center" description="Both axes, any content.">
      <Center className="h-16">
        <Block accent className="h-6 w-16" />
      </Center>
    </LayoutCard>
  );
}
