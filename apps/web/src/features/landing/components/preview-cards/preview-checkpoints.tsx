import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { HistoryIcon } from '@repo/ui/icons/history';
import { cn } from '@repo/ui/lib/cn';

const checkpoints = [
  { title: 'Added the pricing table', meta: '2 min ago · 3 files', current: true },
  { title: 'Reworked the hero', meta: '14 min ago · 1 file', current: false },
  { title: 'Initial scaffold', meta: '1 h ago · 12 files', current: false },
];

export function PreviewCheckpoints() {
  return (
    <Card>
      <Card.Header compact>
        <div className="flex items-center justify-between gap-2">
          <Card.Title className="text-sm font-semibold">Checkpoints</Card.Title>
          <span className="text-muted-foreground text-[11px]">3 saved</span>
        </div>
      </Card.Header>
      <Card.Content compact>
        <ol className="space-y-4">
          {checkpoints.map((checkpoint, index) => (
            <li key={checkpoint.title} className="flex items-start gap-3">
              <span
                className={cn(
                  'mt-1 size-2 shrink-0 rounded-full',
                  checkpoint.current ? 'bg-foreground' : 'border-border-interactive border',
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="text-foreground text-xs font-medium">{checkpoint.title}</div>
                <div className="text-muted-foreground mt-0.5 text-[11px]">{checkpoint.meta}</div>
              </div>
              {checkpoint.current ? (
                <Badge variant="secondary" className="text-[10px]">
                  Current
                </Badge>
              ) : index === 1 ? (
                <Button size="sm" variant="outline" className="h-7 gap-1.5 px-2 text-[11px]">
                  <HistoryIcon size={12} />
                  Restore
                </Button>
              ) : null}
            </li>
          ))}
        </ol>
      </Card.Content>
    </Card>
  );
}
