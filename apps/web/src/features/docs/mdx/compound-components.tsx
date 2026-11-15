'use client';

import type * as React from 'react';

import { Accordion } from '@repo/ui/components/accordion';
import { Tree } from '@repo/ui/components/tree';
import { Table } from '@repo/ui/components/table';
import { Tabs } from '@repo/ui/components/tabs';
import { cn } from '@repo/ui/lib/cn';

export const MdxTabs = Tabs;
export const MdxTabsContent = Tabs.Content;
export const MdxTabsList = Tabs.List;
export const MdxTabsTrigger = Tabs.Trigger;

export const MdxAccordion = Accordion;
export const MdxAccordionItem = Accordion.Item;
export const MdxAccordionTrigger = Accordion.Trigger;
export const MdxAccordionContent = Accordion.Content;

export function MdxTable({ className, ...props }: React.ComponentProps<typeof Table>) {
  return <Table className={cn('text-sm [&_code]:whitespace-nowrap!', className)} {...props} />;
}
export const MdxTableHeader = Table.Header;
export const MdxTableBody = Table.Body;
export const MdxTableRow = Table.Row;
export const MdxTableHead = Table.Head;
export const MdxTableCell = Table.Cell;

export const MdxTree = Tree;
export const MdxTreeItem = Tree.Item;
