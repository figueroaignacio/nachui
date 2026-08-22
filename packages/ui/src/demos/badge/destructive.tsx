import { Badge } from '../../components/badge';
import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

const deploys = [
  { branch: 'main', commit: '8f2c1a4', message: 'Bump checkout timeout', status: 'Failed' },
  { branch: 'fix/webhooks', commit: '3ad9e07', message: 'Retry Stripe webhooks', status: 'Failed' },
];

export function Destructive() {
  return (
    <Stack gap="4" className="border-border bg-card w-full max-w-md rounded-xl border p-4">
      {deploys.map((deploy) => (
        <Flex key={deploy.commit} align="center" justify="between" gap="4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{deploy.message}</p>
            <p className="text-muted-foreground truncate font-mono text-xs">
              {deploy.branch} · {deploy.commit}
            </p>
          </div>
          <Badge variant="destructive">{deploy.status}</Badge>
        </Flex>
      ))}
    </Stack>
  );
}
