'use client';

import * as React from 'react';
import { Checkbox } from '../components/checkbox';
import { DropdownMenu } from '../components/dropdown-menu';
import { Empty } from '../components/empty';
import { Input } from '../components/input';
import { Pagination } from '../components/pagination';
import { Table } from '../components/table';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function SearchIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ColumnsIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="M15 4v16" />
    </svg>
  );
}

function CheckIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowUpIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function ArrowUpDownIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

type SortDirection = 'asc' | 'desc';

interface DataTableSort {
  id: string;
  direction: SortDirection;
}

interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | Date;
  filterValue?: (row: T) => string;
  align?: 'start' | 'end';
  hidden?: boolean;
  width?: string;
}

interface DataTableLabels {
  filter: string;
  columns: string;
  selected: (count: number, total: number) => string;
  page: (page: number, pageCount: number) => string;
  previous: string;
  next: string;
  selectAll: string;
  selectRow: string;
  sortBy: (header: string) => string;
}

const DEFAULT_LABELS: DataTableLabels = {
  filter: 'Filter…',
  columns: 'Columns',
  selected: (count, total) => `${count} of ${total} selected`,
  page: (page, pageCount) => `Page ${page} of ${pageCount}`,
  previous: 'Previous',
  next: 'Next',
  selectAll: 'Select all rows',
  selectRow: 'Select row',
  sortBy: (header) => `Sort by ${header}`,
};

interface DataTableQuery<T> {
  columns: DataTableColumn<T>[];
  filter?: string;
  sort?: DataTableSort | null;
  page?: number;
  pageSize?: number;
}

interface DataTableResult<T> {
  rows: T[];
  total: number;
  pageCount: number;
}

const toComparable = (value: string | number | Date): string | number =>
  value instanceof Date ? value.getTime() : value;

const compare = (a: string | number | Date, b: string | number | Date): number => {
  const left = toComparable(a);
  const right = toComparable(b);
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right), undefined, { numeric: true });
};

const columnText = <T,>(column: DataTableColumn<T>, row: T): string | null => {
  if (column.filterValue) return column.filterValue(row);
  if (column.sortValue) return String(toComparable(column.sortValue(row)));
  const cell = column.cell(row);
  return typeof cell === 'string' || typeof cell === 'number' ? String(cell) : null;
};

function applyDataTable<T>(data: T[], query: DataTableQuery<T>): DataTableResult<T> {
  const { columns, filter = '', sort = null, page = 1, pageSize = 10 } = query;
  const needle = filter.trim().toLowerCase();

  let rows = needle
    ? data.filter((row) =>
        columns.some((column) => {
          const text = columnText(column, row);
          return text !== null && text.toLowerCase().includes(needle);
        }),
      )
    : [...data];

  const sortColumn = sort ? columns.find((column) => column.id === sort.id) : undefined;
  if (sort && sortColumn?.sortValue) {
    const read = sortColumn.sortValue;
    const sign = sort.direction === 'asc' ? 1 : -1;
    rows = rows
      .map((row, index) => ({ row, index }))
      .sort((a, b) => compare(read(a.row), read(b.row)) * sign || a.index - b.index)
      .map((entry) => entry.row);
  }

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;

  return { rows: rows.slice(start, start + pageSize), total, pageCount };
}

interface DataTableContextValue<T> {
  columns: DataTableColumn<T>[];
  visibleColumns: DataTableColumn<T>[];
  hiddenIds: Set<string>;
  toggleColumn: (id: string) => void;
  rows: T[];
  total: number;
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
  filter: string;
  setFilter: (filter: string) => void;
  filterPlaceholder?: string;
  sort: DataTableSort | null;
  toggleSort: (id: string) => void;
  selectable: boolean;
  selected: Set<string>;
  toggleRow: (id: string) => void;
  toggleAll: () => void;
  getRowId: (row: T) => string;
  emptyTitle: string;
  emptyDescription?: string;
  labels: DataTableLabels;
}

const DataTableContext = React.createContext<DataTableContextValue<unknown> | null>(null);

function useDataTable<T = unknown>(): DataTableContextValue<T> {
  const context = React.use(DataTableContext);
  if (!context) {
    throw new Error('DataTable components must be used within DataTable');
  }
  return context as DataTableContextValue<T>;
}

interface DataTableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  pageSize?: number;
  selectable?: boolean;
  selected?: Set<string> | string[];
  onSelectedChange?: (selected: string[]) => void;
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  filter?: string;
  onFilterChange?: (filter: string) => void;
  filterPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  labels?: Partial<DataTableLabels>;
  children?: React.ReactNode;
}

const toSet = (value: Set<string> | string[] | undefined): Set<string> =>
  value instanceof Set ? value : new Set(value ?? []);

function DataTableRoot<T>({
  data,
  columns,
  getRowId,
  pageSize = 10,
  selectable = false,
  selected: controlledSelected,
  onSelectedChange,
  sort: controlledSort,
  onSortChange,
  filter: controlledFilter,
  onFilterChange,
  filterPlaceholder,
  emptyTitle = 'No results',
  emptyDescription,
  labels: labelOverrides,
  className,
  children,
  ref,
  ...props
}: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }) {
  const labels = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labelOverrides }), [labelOverrides]);

  const [internalFilter, setInternalFilter] = React.useState('');
  const filter = controlledFilter ?? internalFilter;
  const [internalSort, setInternalSort] = React.useState<DataTableSort | null>(null);
  const sort = controlledSort === undefined ? internalSort : controlledSort;
  const [internalSelected, setInternalSelected] = React.useState<Set<string>>(() => new Set());
  const selected = controlledSelected === undefined ? internalSelected : toSet(controlledSelected);
  const [page, setPageState] = React.useState(1);
  const [hiddenIds, setHiddenIds] = React.useState<Set<string>>(
    () => new Set(columns.filter((column) => column.hidden).map((column) => column.id)),
  );

  const setFilter = React.useCallback(
    (next: string) => {
      if (controlledFilter === undefined) setInternalFilter(next);
      onFilterChange?.(next);
      setPageState(1);
    },
    [controlledFilter, onFilterChange],
  );

  const toggleSort = React.useCallback(
    (id: string) => {
      const next: DataTableSort | null =
        sort?.id !== id
          ? { id, direction: 'asc' }
          : sort.direction === 'asc'
            ? { id, direction: 'desc' }
            : null;
      if (controlledSort === undefined) setInternalSort(next);
      onSortChange?.(next);
    },
    [sort, controlledSort, onSortChange],
  );

  const commitSelected = React.useCallback(
    (next: Set<string>) => {
      if (controlledSelected === undefined) setInternalSelected(next);
      onSelectedChange?.([...next]);
    },
    [controlledSelected, onSelectedChange],
  );

  const visibleColumns = React.useMemo(
    () => columns.filter((column) => !hiddenIds.has(column.id)),
    [columns, hiddenIds],
  );

  const result = React.useMemo(
    () => applyDataTable(data, { columns, filter, sort, page, pageSize }),
    [data, columns, filter, sort, page, pageSize],
  );

  const setPage = React.useCallback(
    (next: number) => setPageState(Math.min(Math.max(1, next), result.pageCount)),
    [result.pageCount],
  );

  const toggleRow = React.useCallback(
    (id: string) => {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      commitSelected(next);
    },
    [selected, commitSelected],
  );

  const toggleAll = React.useCallback(() => {
    const ids = result.rows.map(getRowId);
    const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
    const next = new Set(selected);
    for (const id of ids) {
      if (allSelected) next.delete(id);
      else next.add(id);
    }
    commitSelected(next);
  }, [result.rows, getRowId, selected, commitSelected]);

  const toggleColumn = React.useCallback((id: string) => {
    setHiddenIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value = React.useMemo<DataTableContextValue<T>>(
    () => ({
      columns,
      visibleColumns,
      hiddenIds,
      toggleColumn,
      rows: result.rows,
      total: result.total,
      page: Math.min(page, result.pageCount),
      pageCount: result.pageCount,
      setPage,
      filter,
      setFilter,
      filterPlaceholder,
      sort,
      toggleSort,
      selectable,
      selected,
      toggleRow,
      toggleAll,
      getRowId,
      emptyTitle,
      emptyDescription,
      labels,
    }),
    [
      columns,
      visibleColumns,
      hiddenIds,
      toggleColumn,
      result,
      page,
      setPage,
      filter,
      setFilter,
      filterPlaceholder,
      sort,
      toggleSort,
      selectable,
      selected,
      toggleRow,
      toggleAll,
      getRowId,
      emptyTitle,
      emptyDescription,
      labels,
    ],
  );

  return (
    <DataTableContext value={value as DataTableContextValue<unknown>}>
      <div ref={ref} className={cn('flex w-full flex-col gap-3', className)} {...props}>
        {children ?? (
          <>
            <DataTableToolbar />
            <DataTableContent />
            <DataTableFooter />
          </>
        )}
      </div>
    </DataTableContext>
  );
}

DataTableRoot.displayName = 'DataTable';

type DataTableToolbarProps = React.HTMLAttributes<HTMLDivElement>;

const DataTableToolbar = ({
  className,
  children,
  ref,
  ...props
}: DataTableToolbarProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { filter, setFilter, filterPlaceholder, columns, hiddenIds, toggleColumn, labels } =
    useDataTable();

  return (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-center justify-between gap-2', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Input
          size="sm"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={filterPlaceholder ?? labels.filter}
          leftIcon={<SearchIcon size={14} />}
          className="max-w-xs"
          aria-label={labels.filter}
        />
        {children}
      </div>
      <DropdownMenu>
        <DropdownMenu.Trigger className="border-border hover:bg-muted text-foreground inline-flex h-8 items-center gap-2 rounded-md border px-3 text-xs transition-colors">
          <ColumnsIcon size={14} />
          {labels.columns}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {columns.map((column) => {
            const visible = !hiddenIds.has(column.id);
            return (
              <DropdownMenu.Item
                key={column.id}
                onSelect={() => toggleColumn(column.id)}
                className="gap-2 text-xs"
              >
                <span
                  aria-hidden="true"
                  className={cn('flex size-3.5 items-center', !visible && 'opacity-0')}
                >
                  <CheckIcon size={14} />
                </span>
                {column.header}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

DataTableToolbar.displayName = 'DataTableToolbar';

type DataTableContentProps = React.HTMLAttributes<HTMLTableElement>;

const DataTableContent = ({
  className,
  ref,
  ...props
}: DataTableContentProps & { ref?: React.Ref<HTMLTableElement> }) => {
  const {
    visibleColumns,
    rows,
    sort,
    toggleSort,
    selectable,
    selected,
    toggleRow,
    toggleAll,
    getRowId,
    emptyTitle,
    emptyDescription,
    labels,
  } = useDataTable();

  const pageIds = rows.map(getRowId);
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length;
  const allOnPage = pageIds.length > 0 && selectedOnPage === pageIds.length;
  const someOnPage = selectedOnPage > 0 && !allOnPage;
  const columnCount = visibleColumns.length + (selectable ? 1 : 0);

  return (
    <Table ref={ref} className={className} {...props}>
      <Table.Header>
        <Table.Row>
          {selectable ? (
            <Table.Head className="w-10">
              <Checkbox
                aria-label={labels.selectAll}
                checked={allOnPage}
                indeterminate={someOnPage}
                onCheckedChange={toggleAll}
              />
            </Table.Head>
          ) : null}
          {visibleColumns.map((column) => {
            const active = sort?.id === column.id;
            const ariaSort = active
              ? sort.direction === 'asc'
                ? 'ascending'
                : 'descending'
              : column.sortable
                ? 'none'
                : undefined;
            return (
              <Table.Head
                key={column.id}
                aria-sort={ariaSort}
                style={column.width ? { width: column.width } : undefined}
                className={cn(column.align === 'end' && 'text-right')}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(column.id)}
                    aria-label={
                      typeof column.header === 'string' ? labels.sortBy(column.header) : undefined
                    }
                    className={cn(
                      'hover:text-foreground focus-visible:ring-ring -mx-1 inline-flex items-center gap-1.5 rounded-sm px-1 transition-colors focus-visible:ring-2 focus-visible:outline-none',
                      active && 'text-foreground',
                      column.align === 'end' && 'flex-row-reverse',
                    )}
                  >
                    {column.header}
                    {active ? (
                      <ArrowUpIcon
                        size={12}
                        className={cn(
                          'transition-transform',
                          sort.direction === 'desc' && 'rotate-180',
                        )}
                      />
                    ) : (
                      <ArrowUpDownIcon size={12} className="opacity-50" />
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </Table.Head>
            );
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={columnCount} className="p-0">
              <Empty className="py-8">
                <Empty.Header>
                  <Empty.Title>{emptyTitle}</Empty.Title>
                  {emptyDescription ? (
                    <Empty.Description>{emptyDescription}</Empty.Description>
                  ) : null}
                </Empty.Header>
              </Empty>
            </Table.Cell>
          </Table.Row>
        ) : (
          rows.map((row) => {
            const id = getRowId(row);
            const isSelected = selected.has(id);
            return (
              <Table.Row key={id} data-state={isSelected ? 'selected' : undefined}>
                {selectable ? (
                  <Table.Cell className="w-10">
                    <Checkbox
                      aria-label={labels.selectRow}
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(id)}
                    />
                  </Table.Cell>
                ) : null}
                {visibleColumns.map((column) => (
                  <Table.Cell
                    key={column.id}
                    className={cn(column.align === 'end' && 'text-right tabular-nums')}
                  >
                    {column.cell(row)}
                  </Table.Cell>
                ))}
              </Table.Row>
            );
          })
        )}
      </Table.Body>
    </Table>
  );
};

DataTableContent.displayName = 'DataTableContent';

type DataTableFooterProps = React.HTMLAttributes<HTMLDivElement>;

const DataTableFooter = ({
  className,
  children,
  ref,
  ...props
}: DataTableFooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { selectable, selected, total, page, pageCount, setPage, labels } = useDataTable();

  return (
    <div
      ref={ref}
      className={cn(
        'text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-xs',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {selectable ? <span>{labels.selected(selected.size, total)}</span> : null}
        {children}
      </div>
      <div className="flex items-center gap-3">
        <span className="tabular-nums">{labels.page(page, pageCount)}</span>
        <Pagination className="mx-0 w-auto">
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous iconOnly disabled={page <= 1} onClick={() => setPage(page - 1)}>
                {labels.previous}
              </Pagination.Previous>
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Next
                iconOnly
                disabled={page >= pageCount}
                onClick={() => setPage(page + 1)}
              >
                {labels.next}
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>
    </div>
  );
};

DataTableFooter.displayName = 'DataTableFooter';

const DataTable = Object.assign(DataTableRoot, {
  Toolbar: DataTableToolbar,
  Content: DataTableContent,
  Footer: DataTableFooter,
});

export { applyDataTable, DataTable, useDataTable };
export type {
  DataTableColumn,
  DataTableContentProps,
  DataTableFooterProps,
  DataTableLabels,
  DataTableProps,
  DataTableQuery,
  DataTableResult,
  DataTableSort,
  DataTableToolbarProps,
  SortDirection,
};
