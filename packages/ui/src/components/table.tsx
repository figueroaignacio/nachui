import * as React from 'react';
import { cn } from '../lib/cn';

const TableRoot = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableElement> & { ref?: React.Ref<HTMLTableElement> }) => (
  <div className="border-border relative w-full overflow-auto rounded-md border">
    <table ref={ref} className={cn('w-full text-xs', className)} {...props} />
  </div>
);
TableRoot.displayName = 'Table';

const TableHeader = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => <thead ref={ref} className={cn('bg-card [&_tr]:border-b', className)} {...props} />;
TableHeader.displayName = 'TableHeader';

const TableBody = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
TableBody.displayName = 'TableBody';

const TableFooter = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => (
  <tfoot
    ref={ref}
    className={cn('border-t font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
);
TableFooter.displayName = 'TableFooter';

const TableRow = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { ref?: React.Ref<HTMLTableRowElement> }) => (
  <tr
    ref={ref}
    className={cn(
      'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
      className,
    )}
    {...props}
  />
);
TableRow.displayName = 'TableRow';

const TableHead = ({
  className,
  ref,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { ref?: React.Ref<HTMLTableCellElement> }) => (
  <th
    ref={ref}
    className={cn(
      'border-border text-muted-foreground h-10 border-r px-3 py-4 text-left align-middle font-medium last:border-r-0 [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
);
TableHead.displayName = 'TableHead';

const TableCell = ({
  className,
  ref,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { ref?: React.Ref<HTMLTableCellElement> }) => (
  <td
    ref={ref}
    className={cn(
      'border-border border-r px-3 py-4 align-middle last:border-r-0 [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
);
TableCell.displayName = 'TableCell';

const TableCaption = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement> & {
  ref?: React.Ref<HTMLTableCaptionElement>;
}) => (
  <caption ref={ref} className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
);
TableCaption.displayName = 'TableCaption';

const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
});

export { Table };
