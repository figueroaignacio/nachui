import { Checkbox } from '../../components/checkbox';

const invoices = [
  { id: 'INV-2043', customer: 'Vela Studio', amount: '$1,280', selected: true },
  { id: 'INV-2044', customer: 'Northwind Labs', amount: '$460', selected: false },
  { id: 'INV-2045', customer: 'Harbor Freight Co', amount: '$3,910', selected: false },
];

export function Default() {
  return (
    <div className="border-border bg-card w-full max-w-md rounded-xl border">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="border-border flex items-center gap-3 border-b p-3 last:border-b-0"
        >
          <Checkbox aria-label={`Select invoice ${invoice.id}`} defaultChecked={invoice.selected} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{invoice.customer}</p>
            <p className="text-muted-foreground text-xs">{invoice.id}</p>
          </div>
          <p className="text-sm tabular-nums">{invoice.amount}</p>
        </div>
      ))}
    </div>
  );
}
