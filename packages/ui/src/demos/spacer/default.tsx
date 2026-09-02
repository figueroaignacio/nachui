'use client';

import { Notification03Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '../../components/avatar';
import { Button } from '../../components/button';
import { Flex } from '../../layout/flex';
import { Spacer } from '../../layout/spacer';

export function Default() {
  return (
    <Flex
      align="center"
      gap="2"
      className="border-border bg-card w-full max-w-md rounded-xl border px-3 py-2"
    >
      <span className="px-2 text-sm font-semibold">Northwind</span>
      <Spacer />
      <Button variant="ghost" size="icon" aria-label="Search">
        <HugeiconsIcon icon={Search01Icon} size={16} />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <HugeiconsIcon icon={Notification03Icon} size={16} />
      </Button>
      <Avatar size="sm">
        <Avatar.Fallback>IF</Avatar.Fallback>
      </Avatar>
    </Flex>
  );
}
