'use client';

import { DataTable, type DataTableColumn } from '../../hybrids/data-table';

type Release = { version: string; date: string; changes: number };

const RELEASES: Release[] = [
  { version: '1.4.0', date: '2026-09-18', changes: 12 },
  { version: '1.3.2', date: '2026-09-02', changes: 3 },
  { version: '1.3.1', date: '2026-08-27', changes: 1 },
  { version: '1.3.0', date: '2026-08-20', changes: 9 },
  { version: '1.2.0', date: '2026-07-30', changes: 15 },
];

const COLUMNS: DataTableColumn<Release>[] = [
  {
    id: 'version',
    header: 'Version',
    cell: (row) => <span className="font-mono">{row.version}</span>,
  },
  { id: 'date', header: 'Date', cell: (row) => row.date },
  { id: 'changes', header: 'Changes', cell: (row) => row.changes, align: 'end' },
];

export function Compact() {
  return (
    <div className="w-full max-w-md">
      <DataTable data={RELEASES} columns={COLUMNS} getRowId={(row) => row.version}>
        <DataTable.Content />
      </DataTable>
    </div>
  );
}
