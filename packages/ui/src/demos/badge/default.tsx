import { Badge } from '../../components/badge';
import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

export function Default() {
  return (
    <Stack gap="1" className="border-border bg-card w-full max-w-sm rounded-xl border p-4">
      <Flex align="center" gap="2">
        <p className="truncate text-sm font-medium">Acme Studio</p>
        <Badge>Pro</Badge>
      </Flex>
      <p className="text-muted-foreground text-xs">Renews Apr 12, 7 of 10 seats used</p>
    </Stack>
  );
}
