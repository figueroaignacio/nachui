'use client';

import { Button } from '../../components/button';
import { Dialog } from '../../components/dialog';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import { Select } from '../../components/select';

export function Default() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>Invite teammate</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Invite to Northwind</Dialog.Title>
          <Dialog.Description>
            They get an email with a join link that expires in 7 days. Each extra seat is billed at
            $12 per month.
          </Dialog.Description>
        </Dialog.Header>
        <div className="grid gap-4 py-2">
          <Input
            id="invite-email"
            type="email"
            label="Work email"
            placeholder="teammate@northwind.io"
            description="Only addresses on northwind.io skip manual approval."
          />
          <div className="grid gap-1.5">
            <Label htmlFor="invite-role">Role</Label>
            <Select id="invite-role" defaultValue="developer">
              <option value="admin">Admin, full access including billing</option>
              <option value="developer">Developer, can deploy and read logs</option>
              <option value="viewer">Viewer, read only</option>
            </Select>
          </div>
        </div>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button>Send invite</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
