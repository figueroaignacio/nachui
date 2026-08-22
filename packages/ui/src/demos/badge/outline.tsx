import { Badge } from '../../components/badge';
import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

const tags = ['v2.4.0', 'node 22', 'eu-central-1'];

export function Outline() {
  return (
    <Stack gap="3" className="border-border bg-card w-full max-w-sm rounded-xl border p-4">
      <div>
        <p className="text-sm font-medium">checkout-api</p>
        <p className="text-muted-foreground mt-1 text-xs">Deployed Mar 14 at 09:41</p>
      </div>
      <Flex wrap="wrap" gap="2">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </Flex>
    </Stack>
  );
}
