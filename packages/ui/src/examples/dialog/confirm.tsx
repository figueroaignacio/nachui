'use client';

import { Button } from '../../components/button';
import { Dialog } from '../../components/dialog';
import { Input } from '../../components/input';

export function Confirm() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="destructive">Delete project</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete storefront-api?</Dialog.Title>
          <Dialog.Description>
            Deployments, domains and environment variables are removed permanently. Type the project
            name to confirm.
          </Dialog.Description>
        </Dialog.Header>
        <Input id="confirm-name" aria-label="Project name" placeholder="storefront-api" />
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button variant="destructive">Delete permanently</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
