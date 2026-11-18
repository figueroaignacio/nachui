import { Button } from '../../components/button';
import { UserPlusIcon } from '../../icons/user-plus';
import { Flex } from '../../layout/flex';

export function Secondary() {
  return (
    <Flex
      align="center"
      justify="between"
      gap="4"
      className="bg-card w-full max-w-md rounded-lg p-4 shadow-sm"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">Seats</p>
        <p className="text-muted-foreground text-xs">7 of 10 used on the Team plan</p>
      </div>
      <Button variant="secondary" leftIcon={<UserPlusIcon className="size-4" size={16} />}>
        Invite teammate
      </Button>
    </Flex>
  );
}
