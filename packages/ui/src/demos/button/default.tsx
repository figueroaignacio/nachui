import { Button } from '../../components/button';
import { Flex } from '../../layout/flex';

export function Default() {
  return (
    <Flex
      align="center"
      justify="between"
      gap="4"
      className="border-border bg-card w-full max-w-sm rounded-xl border p-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">Workspace name</p>
        <p className="text-muted-foreground truncate text-xs">Acme Studio</p>
      </div>
      <Button>Save changes</Button>
    </Flex>
  );
}
