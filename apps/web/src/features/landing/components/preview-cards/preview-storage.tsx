import { Card } from '@repo/ui/components/card';
import { cn } from '@repo/ui/lib/cn';

const segments = [
  { label: 'Media', size: '41 GB', width: 'w-[41%]', fill: 'bg-foreground' },
  { label: 'Documents', size: '19 GB', width: 'w-[19%]', fill: 'bg-muted-foreground' },
  { label: 'Backups', size: '8 GB', width: 'w-[8%]', fill: 'bg-input' },
];

export function PreviewStorage() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Storage</Card.Title>
        <Card.Description className="text-xs">68 GB of 100 GB used</Card.Description>
      </Card.Header>
      <Card.Content compact>
        <div className="bg-muted flex h-2 gap-0.5 overflow-hidden rounded-full">
          {segments.map((segment) => (
            <span key={segment.label} className={cn(segment.width, segment.fill)} />
          ))}
        </div>
        <div className="mt-4 space-y-2 text-xs">
          {segments.map((segment) => (
            <div key={segment.label} className="flex justify-between">
              <span className="text-muted-foreground">{segment.label}</span>
              <span className="text-foreground">{segment.size}</span>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
