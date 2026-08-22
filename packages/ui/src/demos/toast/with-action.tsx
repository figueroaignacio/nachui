'use client';

import * as React from 'react';
import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Toast, useToast } from '../../components/toast';
import { Flex } from '../../layout/flex';

function WithActionDemo() {
  const { toast } = useToast();
  const [archived, setArchived] = React.useState(false);

  const archive = () => {
    setArchived(true);
    toast({
      title: 'Project archived',
      description: 'checkout-flow stopped serving traffic and moved to the archive.',
      action: {
        label: 'Undo',
        onClick: () => setArchived(false),
      },
    });
  };

  return (
    <Flex
      align="center"
      justify="between"
      gap="4"
      className="border-border bg-card w-full max-w-md rounded-xl border p-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">checkout-flow</p>
        <p className="text-muted-foreground text-xs">Last deploy Mar 14, 3 environments</p>
      </div>
      <Flex align="center" gap="2">
        <Badge variant={archived ? 'secondary' : 'success'}>
          {archived ? 'Archived' : 'Active'}
        </Badge>
        <Button variant="outline" size="sm" disabled={archived} onClick={archive}>
          Archive
        </Button>
      </Flex>
    </Flex>
  );
}

export function WithAction() {
  return (
    <Toast.Provider>
      <WithActionDemo />
    </Toast.Provider>
  );
}
