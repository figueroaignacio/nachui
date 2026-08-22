'use client';

import { Avatar } from '../../components/avatar';
import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Flex } from '../../layout/flex';

export function Default() {
  return (
    <Flex
      direction="row"
      align="center"
      justify="between"
      gap="4"
      className="border-border bg-card w-full max-w-lg rounded-xl border p-4"
    >
      <Flex align="center" gap="3">
        <Avatar>
          <Avatar.Fallback>LM</Avatar.Fallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Lucia Mendez</p>
          <p className="text-muted-foreground text-xs">lucia@acmestudio.dev</p>
        </div>
      </Flex>
      <Flex align="center" gap="2">
        <Badge variant="secondary">Owner</Badge>
        <Button variant="secondary" size="sm">
          Manage
        </Button>
      </Flex>
    </Flex>
  );
}
