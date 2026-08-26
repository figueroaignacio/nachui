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
      gap="3"
      className="border-border bg-card w-full max-w-lg rounded-xl border p-4 sm:gap-4"
    >
      <Flex align="center" gap="3" className="min-w-0 flex-1">
        <Avatar className="shrink-0">
          <Avatar.Fallback>LM</Avatar.Fallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Lucia Mendez</p>
          <p className="text-muted-foreground truncate text-xs">lucia@acmestudio.dev</p>
        </div>
      </Flex>
      <Flex align="center" gap="2" className="shrink-0">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          Owner
        </Badge>
        <Button variant="secondary" size="sm">
          Manage
        </Button>
      </Flex>
    </Flex>
  );
}
