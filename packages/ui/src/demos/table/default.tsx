import { Badge } from '../../components/badge';
import { Table } from '../../components/table';

const invoices = [
  {
    id: 'INV-2481',
    period: 'Mar 2025',
    status: 'Paid',
    tone: 'success',
    amount: '$248.00',
  },
  {
    id: 'INV-2480',
    period: 'Feb 2025',
    status: 'Paid',
    tone: 'success',
    amount: '$248.00',
  },
  {
    id: 'INV-2479',
    period: 'Jan 2025',
    status: 'Pending',
    tone: 'warning',
    amount: '$248.00',
  },
  {
    id: 'INV-2478',
    period: 'Dec 2024',
    status: 'Overdue',
    tone: 'destructive',
    amount: '$186.00',
  },
] as const;

export function Default() {
  return (
    <Table>
      <Table.Caption>Billing history for the Acme workspace.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[110px]">Invoice</Table.Head>
          <Table.Head>Billing period</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head className="text-right">Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {invoices.map((invoice) => (
          <Table.Row key={invoice.id}>
            <Table.Cell className="font-medium">{invoice.id}</Table.Cell>
            <Table.Cell>{invoice.period}</Table.Cell>
            <Table.Cell>
              <Badge variant={invoice.tone}>{invoice.status}</Badge>
            </Table.Cell>
            <Table.Cell className="text-right tabular-nums">{invoice.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={3}>Billed this period</Table.Cell>
          <Table.Cell className="text-right tabular-nums">$930.00</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}
