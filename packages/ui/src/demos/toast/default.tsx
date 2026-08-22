'use client';

import { Button } from '../../components/button';
import { Toast, useToast } from '../../components/toast';

function ToastDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast({
          title: 'Invitation sent',
          description: 'Lucia Mendez gets access to Acme Studio once she accepts.',
        })
      }
    >
      Invite teammate
    </Button>
  );
}

export function Default() {
  return (
    <Toast.Provider>
      <ToastDemo />
    </Toast.Provider>
  );
}
