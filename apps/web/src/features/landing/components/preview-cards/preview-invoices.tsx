import { Badge } from '@repo/ui/components/badge';
import { Card } from '@repo/ui/components/card';

const invoices = [
  { id: '#1042', amount: '$240.00', paid: true },
  { id: '#1041', amount: '$96.00', paid: true },
  { id: '#1040', amount: '$512.00', paid: false },
  { id: '#1039', amount: '$48.00', paid: true },
];

export function PreviewInvoices() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Invoices</Card.Title>
      </Card.Header>
      <Card.Content compact>
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="border-border flex items-center gap-3 border-b py-2.5 last:border-b-0 last:pb-0"
          >
            <span className="text-muted-foreground font-mono text-[11px]">{invoice.id}</span>
            <span className="text-foreground flex-1 text-right text-xs">{invoice.amount}</span>
            <Badge variant={invoice.paid ? 'success' : 'warning'} className="text-[10px]">
              {invoice.paid ? 'Paid' : 'Due'}
            </Badge>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
