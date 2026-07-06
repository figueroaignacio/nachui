import { Card } from '@repo/ui/components/card';
import { Label } from '@repo/ui/components/label';
import { Spinner } from '@repo/ui/components/spinner';

export function PreviewSpinners() {
  return (
    <Card variant="outline" className="bg-card">
      <Card.Content compact className="flex flex-col gap-4 pt-5 pb-5">
        <Label className="text-[10px] font-bold tracking-widest uppercase opacity-70">
          Loading States
        </Label>
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <span className="text-muted-foreground text-[9px] font-bold uppercase">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="text-muted-foreground text-[9px] font-bold uppercase">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-muted-foreground text-[9px] font-bold uppercase">Large</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
