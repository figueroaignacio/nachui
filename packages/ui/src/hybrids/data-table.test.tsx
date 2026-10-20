import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
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
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows on this page' }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(['r1', 'r2', 'r3']);
    expect(screen.getByText('3 of 12 selected')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select row Row 01' }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(['r2', 'r3']);
    expect(screen.getByRole('checkbox', { name: 'Select all rows on this page' })).toHaveProperty(
      'indeterminate',
      true,
    );
  });

  it('hides a column from the columns menu', async () => {
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} />);
    await userEvent.click(screen.getByRole('button', { name: /Columns/ }));
    const status = screen.getByRole('menuitemcheckbox', { name: /Status/ });
    expect(status).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(status);
    expect(screen.queryByRole('columnheader', { name: /Status/ })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitemcheckbox', { name: /Status/ })).toHaveAttribute(
      'aria-checked',
      'false',
    );
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

  it('names each row checkbox with a label function', () => {
    render(
      <DataTable
        data={ROWS.slice(0, 2)}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        selectable
        labels={{ selectRow: (row) => `Select ${row.name}` }}
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Select Row 02' })).toBeInTheDocument();
  });

  it('keeps focus on Next when it reaches the last page', async () => {
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} pageSize={5} />);
    const next = screen.getByRole('button', { name: 'Next' });
    await userEvent.click(next);
    await userEvent.click(next);
    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
    expect(next).toHaveAttribute('aria-disabled', 'true');
    expect(next).not.toBeDisabled();
    expect(next).toHaveFocus();
    await userEvent.click(next);
    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).not.toHaveAttribute('aria-disabled');
  });

  it('counts only selected rows that match the filter', async () => {
    render(
      <DataTable
        data={ROWS}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        selectable
        selected={['r1', 'r2']}
      />,
    );
    expect(screen.getByText('2 of 12 selected')).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText('Filter…'), 'Row 01');
    expect(screen.getByText('1 of 1 selected')).toBeInTheDocument();
  });

  it('announces the result count in a polite live region', async () => {
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} pageSize={5} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('12 results, page 1 of 3');
    await userEvent.type(screen.getByPlaceholderText('Filter…'), 'Row 11');
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('1 result, page 1 of 1');
  });

  it('renders skeleton rows and marks the table busy while loading', () => {
    render(
      <DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} pageSize={5} loading />,
    );
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Row 01')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
  });

  it('never hides the last visible column', async () => {
    const columns = COLUMNS.map((column) =>
      column.id === 'name' ? column : { ...column, hidden: true },
    );
    render(<DataTable data={ROWS} columns={columns} getRowId={(row) => row.id} />);
    await userEvent.click(screen.getByRole('button', { name: /Columns/ }));
    const item = screen.getByRole('menuitemcheckbox', { name: /Name/ });
    expect(item).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(item);
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument();
  });

  it('aligns end columns with logical properties', () => {
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} />);
    expect(screen.getByRole('columnheader', { name: /Amount/ })).toHaveClass('text-end');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DataTable
        data={ROWS}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        pageSize={5}
        selectable
      />,
    );
    await expectNoAxeViolations(container);
  });
});
