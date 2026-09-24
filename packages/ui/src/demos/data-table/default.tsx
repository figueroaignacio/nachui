'use client';

import { Badge } from '../../components/badge';
import { DataTable, type DataTableColumn } from '../../hybrids/data-table';

type Invoice = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issued: Date;
};

const CUSTOMERS = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella',
  'Hooli',
  'Vehement Capital',
  'Stark Industries',
  'Wayne Enterprises',
  'Wonka',
  'Cyberdyne',
  'Tyrell',
  'Soylent',
  'Massive Dynamic',
  'Aperture',
  'Sirius Cybernetics',
  'Oscorp',
  'Gringotts',
  'Prestige Worldwide',
  'Dunder Mifflin',
  'Los Pollos Hermanos',
  'Pied Piper',
  'Bluth Company',
  'Sterling Cooper',
];

const STATUSES: Invoice['status'][] = ['paid', 'pending', 'overdue'];

const INVOICES: Invoice[] = CUSTOMERS.map((customer, index) => ({
  id: `INV-${String(1042 + index)}`,
  customer,
  email: `billing@${customer.toLowerCase().replace(/[^a-z]/g, '')}.com`,
  amount: 250 + ((index * 731) % 4800),
  status: STATUSES[(index * 7) % 3] ?? 'paid',
  issued: new Date(2026, 8, 24 - index),
}));

const TONE: Record<Invoice['status'], 'success' | 'warning' | 'destructive'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'destructive',
};

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

const COLUMNS: DataTableColumn<Invoice>[] = [
  {
    id: 'id',
    header: 'Invoice',
    cell: (row) => <span className="font-mono">{row.id}</span>,
    sortable: true,
    sortValue: (row) => row.id,
    filterValue: (row) => row.id,
    width: '7rem',
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: (row) => (
      <div className="flex flex-col">
        <span className="text-foreground font-medium">{row.customer}</span>
        <span className="text-muted-foreground">{row.email}</span>
      </div>
    ),
    sortable: true,
    sortValue: (row) => row.customer,
    filterValue: (row) => `${row.customer} ${row.email}`,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <Badge variant={TONE[row.status]}>{row.status}</Badge>,
    sortable: true,
    sortValue: (row) => row.status,
    filterValue: (row) => row.status,
  },
  {
    id: 'issued',
    header: 'Issued',
    cell: (row) => date.format(row.issued),
    sortable: true,
    sortValue: (row) => row.issued,
    hidden: true,
  },
  {
    id: 'amount',
    header: 'Amount',
    cell: (row) => money.format(row.amount),
    sortable: true,
    sortValue: (row) => row.amount,
    align: 'end',
    width: '8rem',
  },
];

export function Default() {
  return (
    <DataTable
      data={INVOICES}
      columns={COLUMNS}
      getRowId={(row) => row.id}
      pageSize={6}
      selectable
      filterPlaceholder="Filter invoices…"
      emptyTitle="No invoices match"
      emptyDescription="Try a customer name, an invoice number or a status."
    />
  );
}
