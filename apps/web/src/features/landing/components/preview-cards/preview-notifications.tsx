import { Card } from '@repo/ui/components/card';
import { Switch } from '@repo/ui/components/switch';

export function PreviewNotifications() {
  return (
    <Card variant="outline" className="bg-card">
      <Card.Content compact className="flex items-center justify-between p-4 px-5">
        <div>
          <div className="text-foreground text-sm font-bold">Allow notifications</div>
          <div className="text-muted-foreground mt-0.5 text-xs">
            Receive push notifications from NachUI
          </div>
        </div>
        <Switch defaultChecked />
      </Card.Content>
    </Card>
  );
}
