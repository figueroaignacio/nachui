import { UserAdd01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';
import { Flex } from '../../layout/flex';

export function Secondary() {
  return (
    <Flex
      align="center"
      justify="between"
      gap="4"
      className="border-border bg-card w-full max-w-md rounded-xl border p-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">Seats</p>
        <p className="text-muted-foreground text-xs">7 of 10 used on the Team plan</p>
      </div>
      <Button
        variant="secondary"
        leftIcon={<HugeiconsIcon icon={UserAdd01Icon} className="size-4" size={16} />}
      >
        Invite teammate
      </Button>
    </Flex>
  );
}
