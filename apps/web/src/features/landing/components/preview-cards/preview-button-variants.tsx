import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Label } from '@repo/ui/components/label';

export function PreviewButtonVariants() {
  return (
    <Card variant="outline" className="bg-card">
      <Card.Content compact className="flex flex-col gap-4 pt-5 pb-5">
        <Label className="text-[10px] font-bold tracking-widest uppercase opacity-70">
          Button Variants
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="default" size="sm">
            Default
          </Button>
          <Button variant="secondary" size="sm">
            Secondary
          </Button>
          <Button variant="outline" size="sm">
            Outline
          </Button>
          <Button variant="ghost" size="sm">
            Ghost
          </Button>
          <Button variant="destructive" size="sm">
            Destructive
          </Button>
          <Button variant="link" size="sm">
            Link
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}
