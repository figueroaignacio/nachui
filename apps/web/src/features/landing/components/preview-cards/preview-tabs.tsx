import { Card } from '@repo/ui/components/card';
import { Tabs } from '@repo/ui/components/tabs';

export function PreviewTabs() {
  return (
    <Card variant="outline" className="bg-card">
      <Card.Content compact className="pt-4 pb-4">
        <Tabs defaultValue="account" className="w-full">
          <Tabs.List className="grid w-full grid-cols-2">
            <Tabs.Trigger value="account">Account</Tabs.Trigger>
            <Tabs.Trigger value="security">Security</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="account" className="pt-4">
            <div className="text-muted-foreground text-[11px] leading-relaxed">
              Make changes to your account settings here. Click save when you're done.
            </div>
          </Tabs.Content>
          <Tabs.Content value="security" className="pt-4">
            <div className="text-muted-foreground text-[11px] leading-relaxed">
              Manage your security preferences and two-factor authentication.
            </div>
          </Tabs.Content>
        </Tabs>
      </Card.Content>
    </Card>
  );
}
