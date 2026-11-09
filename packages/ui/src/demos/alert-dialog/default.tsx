'use client';

import { AlertDialog } from '../../components/alert-dialog';
import { Button } from '../../components/button';

export function Default() {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <Button variant="outline">Delete project</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete project?</AlertDialog.Title>
          <AlertDialog.Description>
            This deletes northwind-web, its 14 deployments and every environment variable. The
            domain northwind.io stops resolving within a few minutes. You cannot undo this.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
          <AlertDialog.Action variant="destructive">Delete project</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
