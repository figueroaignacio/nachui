'use client';

import * as React from 'react';
import { Badge } from '../../components/badge';
import { Pagination } from '../../components/pagination';
import { Table as DataTable } from '../../components/table';

const members = [
  { name: 'Lucia Rey', role: 'Owner', tone: 'default' },
  { name: 'Marco Sosa', role: 'Admin', tone: 'secondary' },
  { name: 'Ana Torres', role: 'Member', tone: 'outline' },
  { name: 'Ivan Ruiz', role: 'Member', tone: 'outline' },
  { name: 'Sofia Paz', role: 'Admin', tone: 'secondary' },
  { name: 'Tomas Vidal', role: 'Member', tone: 'outline' },
  { name: 'Carla Mena', role: 'Member', tone: 'outline' },
  { name: 'Diego Luna', role: 'Member', tone: 'outline' },
] as const;

const PAGE_SIZE = 3;
const PAGE_COUNT = Math.ceil(members.length / PAGE_SIZE);

export function Table() {
  const [page, setPage] = React.useState(1);
  const rows = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full max-w-md">
      <DataTable>
        <DataTable.Header>
          <DataTable.Row>
            <DataTable.Head>Member</DataTable.Head>
            <DataTable.Head className="text-right">Role</DataTable.Head>
          </DataTable.Row>
        </DataTable.Header>
        <DataTable.Body>
          {rows.map((member) => (
            <DataTable.Row key={member.name}>
              <DataTable.Cell className="font-medium">{member.name}</DataTable.Cell>
              <DataTable.Cell className="text-right">
                <Badge variant={member.tone}>{member.role}</Badge>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
      </DataTable>
      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="text-muted-foreground text-xs tabular-nums">{members.length} members</span>
        <Pagination className="mx-0 w-auto justify-end">
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                iconOnly
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              />
            </Pagination.Item>
            {Array.from({ length: PAGE_COUNT }, (_, index) => index + 1).map((number) => (
              <Pagination.Item key={number}>
                <Pagination.Link isActive={number === page} onClick={() => setPage(number)}>
                  {number}
                </Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next
                iconOnly
                disabled={page === PAGE_COUNT}
                onClick={() => setPage((current) => Math.min(PAGE_COUNT, current + 1))}
              />
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>
    </div>
  );
}
