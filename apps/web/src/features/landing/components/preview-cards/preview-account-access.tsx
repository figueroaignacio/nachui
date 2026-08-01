import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Separator } from '@repo/ui/components/separator';

export function PreviewAccountAccess() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Account Access</Card.Title>
        <Card.Description className="text-xs">
          Update your credentials or re-authenticate.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-3">
        <Input label="Email Address" placeholder="artist@studio.inc" size="sm" />
        <Input
          label="Current Password"
          type="password"
          defaultValue="correcthorsebattery"
          size="sm"
          readOnly
        />
        <Button size="sm" variant="secondary" fullWidth>
          Update Security
        </Button>
        <Separator className="my-1" />
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-destructive text-xs font-semibold">Danger Zone</div>
            <div className="text-muted-foreground mt-0.5 text-[11px]">
              Archive account and remove all data.
            </div>
          </div>
          <span className="text-muted-foreground text-xs" aria-hidden="true">
            ›
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}
