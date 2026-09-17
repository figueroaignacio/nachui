'use client';

import { Avatar } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Select } from '@repo/ui/components/select';

const members = ['NF', 'AL', 'MV', 'JP'];

export function PreviewInviteTeam() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Invite to workspace</Card.Title>
        <Card.Description className="text-xs">
          They get access to every project in acme.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Email</Label>
          <Input size="sm" placeholder="teammate@acme.com" aria-label="Email" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Role</Label>
          <Select defaultValue="member">
            <Select.Trigger aria-label="Role" />
            <Select.Content>
              <Select.Item value="member">Member, can edit</Select.Item>
              <Select.Item value="admin">Admin, can invite</Select.Item>
              <Select.Item value="viewer">Viewer, read only</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Avatar.Group>
            {members.map((initials) => (
              <Avatar key={initials} size="sm">
                <Avatar.Fallback className="text-[10px]">{initials}</Avatar.Fallback>
              </Avatar>
            ))}
          </Avatar.Group>
          <span className="text-muted-foreground text-[11px]">4 of 10 seats used</span>
        </div>
      </Card.Content>
      <Card.Footer compact className="mt-2">
        <Button size="sm" fullWidth>
          Send invite
        </Button>
      </Card.Footer>
    </Card>
  );
}
