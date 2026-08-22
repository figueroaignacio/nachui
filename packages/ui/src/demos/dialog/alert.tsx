'use client';

import { Button } from '../../components/button';
import { Dialog } from '../../components/dialog';

export function Alert() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="destructive">Revoke key</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Revoke ci-deploy-prod?</Dialog.Title>
          <Dialog.Description>
            Every request signed with this key starts returning 401 right away. Two services used it
            in the last hour, so update your pipeline secrets before you revoke.
          </Dialog.Description>
        </Dialog.Header>
        <div className="border-destructive-border bg-destructive-surface text-destructive-text rounded-md border p-3 text-xs">
          <p className="font-mono">sk_live_9f2c...4ab1</p>
          <p className="mt-1">Created Mar 14, last used 42 minutes ago by deploy-runner</p>
        </div>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Keep key</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button variant="destructive">Revoke key</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
