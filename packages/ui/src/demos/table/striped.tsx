import { Badge } from '../../components/badge';
import { Table } from '../../components/table';
import { cn } from '../../lib/cn';

const endpoints = [
  {
    route: 'GET /v1/orders',
    requests: '128,402',
    errorRate: '0.02%',
    status: 'Healthy',
    tone: 'success',
  },
  {
    route: 'POST /v1/orders',
    requests: '41,908',
    errorRate: '0.11%',
    status: 'Healthy',
    tone: 'success',
  },
  {
    route: 'GET /v1/customers',
    requests: '96,120',
    errorRate: '0.04%',
    status: 'Healthy',
    tone: 'success',
  },
  {
    route: 'POST /v1/webhooks/stripe',
    requests: '8,441',
    errorRate: '2.40%',
    status: 'Degraded',
    tone: 'warning',
  },
  {
    route: 'DELETE /v1/sessions',
    requests: '3,204',
    errorRate: '5.80%',
    status: 'Failing',
    tone: 'destructive',
  },
] as const;

export function Striped() {
  return (
    <Table>
      <Table.Caption>Traffic by endpoint over the last 24 hours.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Endpoint</Table.Head>
          <Table.Head className="text-right">Requests</Table.Head>
          <Table.Head className="text-right">Error rate</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {endpoints.map((endpoint, index) => (
          <Table.Row key={endpoint.route} className={cn(index % 2 === 0 && 'bg-muted/30')}>
            <Table.Cell className="font-mono font-medium">{endpoint.route}</Table.Cell>
            <Table.Cell className="text-right tabular-nums">{endpoint.requests}</Table.Cell>
            <Table.Cell className="text-right tabular-nums">{endpoint.errorRate}</Table.Cell>
            <Table.Cell>
              <Badge variant={endpoint.tone}>{endpoint.status}</Badge>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
