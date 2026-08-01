import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';

export function PreviewDistributeTrack() {
  return (
    <Card>
      <Card.Content compact className="flex flex-col items-center gap-3 py-10 text-center">
        <div
          className="border-border bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full border text-lg"
          aria-hidden="true"
        >
          +
        </div>
        <div className="text-foreground text-sm font-bold">Distribute Track</div>
        <p className="text-muted-foreground max-w-56 text-[11px] leading-relaxed">
          Upload your first master to start reaching listeners on every major platform.
        </p>
        <Button size="sm" variant="secondary" className="mt-1">
          Create Release
        </Button>
      </Card.Content>
    </Card>
  );
}
