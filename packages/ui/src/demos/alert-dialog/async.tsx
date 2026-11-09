'use client';

import * as React from 'react';
import { AlertDialog } from '../../components/alert-dialog';
import { Button } from '../../components/button';

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function Async() {
  const [revoked, setRevoked] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <AlertDialog>
        <AlertDialog.Trigger asChild>
          <Button variant="outline" disabled={revoked}>
            Revoke API key
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Revoke ci-deploy-prod?</AlertDialog.Title>
            <AlertDialog.Description>
              Requests signed with this key start failing with 401 right away. Update the secret in
              your pipeline first.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
              variant="destructive"
              onClick={async () => {
                await wait(1500);
                setRevoked(true);
              }}
            >
              Revoke key
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {revoked ? 'ci-deploy-prod was revoked.' : 'Last used 42 minutes ago by deploy-runner.'}
      </p>
    </div>
  );
}
