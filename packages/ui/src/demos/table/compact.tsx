import { Badge } from '../../components/badge';
import { Table } from '../../components/table';

const deployments = [
  {
    id: 'dpl_9fk2ax',
    branch: 'main',
    status: 'Ready',
    tone: 'success',
    duration: '42s',
  },
  {
    id: 'dpl_7ta1mv',
    branch: 'feat/checkout-v2',
    status: 'Building',
    tone: 'info',
    duration: '1m 12s',
  },
  {
    id: 'dpl_5qr8bd',
    branch: 'fix/webhook-retry',
    status: 'Failed',
    tone: 'destructive',
    duration: '18s',
  },
  {
    id: 'dpl_3nz6yk',
    branch: 'main',
    status: 'Ready',
    tone: 'success',
    duration: '39s',
  },
  {
    id: 'dpl_2hb4lp',
    branch: 'chore/bump-deps',
    status: 'Canceled',
    tone: 'secondary',
    duration: '6s',
  },
] as const;

export function Compact() {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="h-auto py-2 text-xs">Deployment</Table.Head>
          <Table.Head className="h-auto py-2 text-xs">Branch</Table.Head>
          <Table.Head className="h-auto py-2 text-xs">Status</Table.Head>
          <Table.Head className="h-auto py-2 text-right text-xs">Duration</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {deployments.map((deployment) => (
          <Table.Row key={deployment.id}>
            <Table.Cell className="py-2 font-mono font-medium">{deployment.id}</Table.Cell>
            <Table.Cell className="text-muted-foreground py-2">{deployment.branch}</Table.Cell>
            <Table.Cell className="py-2">
              <Badge variant={deployment.tone}>{deployment.status}</Badge>
            </Table.Cell>
            <Table.Cell className="py-2 text-right tabular-nums">{deployment.duration}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
