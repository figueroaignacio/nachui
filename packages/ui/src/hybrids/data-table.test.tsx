import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { applyDataTable, DataTable, type DataTableColumn } from './data-table';

type Row = { id: string; name: string; amount: number; status: string };

const ROWS: Row[] = Array.from({ length: 12 }, (_, index) => ({
  id: `r${index + 1}`,
  name: `Row ${String(index + 1).padStart(2, '0')}`,
  amount: (index * 37) % 100,
  status: index % 3 === 0 ? 'paid' : 'pending',
}));

const COLUMNS: DataTableColumn<Row>[] = [
  { id: 'name', header: 'Name', cell: (row) => row.name, sortable: true, sortValue: (r) => r.name },
  {
    id: 'amount',
    header: 'Amount',
    cell: (row) => row.amount,
    sortable: true,
    sortValue: (row) => row.amount,
    align: 'end',
  },
  { id: 'status', header: 'Status', cell: (row) => row.status },
];

const firstCell = () => {
  const body = screen.getAllByRole('rowgroup')[1]!;
  const row = within(body).getAllByRole('row')[0]!;
  return within(row).getAllByRole('cell')[0]!.textContent;
};

describe('DataTable', () => {
  it('renders headers and the first page of rows', () => {
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} pageSize={5} />);
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument();
    expect(screen.getByText('Row 01')).toBeInTheDocument();
    expect(screen.queryByText('Row 06')).not.toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('narrows rows with the filter', async () => {
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} />);
    await userEvent.type(screen.getByPlaceholderText('Filter…'), 'Row 11');
    expect(screen.getByText('Row 11')).toBeInTheDocument();
    expect(screen.queryByText('Row 01')).not.toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('sorts ascending then descending on a sortable header', async () => {
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} />);
    const header = screen.getByRole('button', { name: 'Sort by Amount' });
    await userEvent.click(header);
    expect(screen.getByRole('columnheader', { name: /Amount/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    expect(firstCell()).toBe('Row 01');
    await userEvent.click(header);
    expect(screen.getByRole('columnheader', { name: /Amount/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(firstCell()).toBe('Row 09');
  });

  it('paginates with next', async () => {
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} pageSize={5} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(screen.getByText('Row 06')).toBeInTheDocument();
  });

  it('selects all rows on the page and toggles one back', async () => {
    const onSelectedChange = vi.fn();
    render(
      <DataTable
        data={ROWS}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        pageSize={3}
        selectable
        onSelectedChange={onSelectedChange}
      />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(['r1', 'r2', 'r3']);
    expect(screen.getByText('3 of 12 selected')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    expect(onSelectedChange).toHaveBeenLastCalledWith(['r2', 'r3']);
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveProperty(
      'indeterminate',
      true,
    );
  });

  it('hides a column from the columns menu', async () => {
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} />);
    await userEvent.click(screen.getByRole('button', { name: /Columns/ }));
    await userEvent.click(screen.getByRole('menuitem', { name: /Status/ }));
    expect(screen.queryByRole('columnheader', { name: /Status/ })).not.toBeInTheDocument();
  });

  it('renders the empty state', () => {
    render(
      <DataTable
        data={[]}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        emptyTitle="Nothing here"
        emptyDescription="Try another filter"
      />,
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Try another filter')).toBeInTheDocument();
  });

  it('applies filter, sort and paging as a pure function', () => {
    const result = applyDataTable(ROWS, {
      columns: COLUMNS,
      filter: 'pending',
      sort: { id: 'amount', direction: 'desc' },
      page: 2,
      pageSize: 3,
    });
    expect(result.total).toBe(8);
    expect(result.pageCount).toBe(3);
    expect(result.rows).toHaveLength(3);
    expect(result.rows.map((row) => row.amount)).toEqual([70, 59, 48]);
  });
});
