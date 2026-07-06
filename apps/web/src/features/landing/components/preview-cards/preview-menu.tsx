import { CreditCardIcon, Logout01Icon, Settings02Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { DropdownMenu } from '@repo/ui/components/dropdown-menu';
import { Label } from '@repo/ui/components/label';
import { Separator } from '@repo/ui/components/separator';

export function PreviewMenu() {
  return (
    <Card variant="outline" className="bg-card">
      <Card.Content compact className="flex flex-col gap-4 pt-5 pb-5">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold tracking-widest uppercase">Settings</Label>
          <Badge variant="secondary" className="h-4 px-1 text-[9px]">
            ACTIVE
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-foreground text-xs font-bold">Account Settings</span>
            <span className="text-muted-foreground text-[10px]">Manage your profile</span>
          </div>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" size="sm" className="h-7 w-7 rounded-full p-0">
                <HugeiconsIcon icon={Settings02Icon} size={14} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="w-48">
              <DropdownMenu.Label>My Account</DropdownMenu.Label>
              <DropdownMenu.Item className="gap-2">
                <HugeiconsIcon icon={UserIcon} size={14} />
                <span>Profile</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="gap-2">
                <HugeiconsIcon icon={CreditCardIcon} size={14} />
                <span>Billing</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item variant="destructive" className="gap-2">
                <HugeiconsIcon icon={Logout01Icon} size={14} />
                <span>Logout</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        <Separator />

        <Button
          variant="secondary"
          size="sm"
          className="h-8 w-full text-[10px] font-bold uppercase"
        >
          View all activity
        </Button>
      </Card.Content>
    </Card>
  );
}
