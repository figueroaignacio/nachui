'use client';

import * as React from 'react';
import { Pagination } from '../../components/pagination';

const TOTAL_PAGES = 12;

export function Compact() {
  const [page, setPage] = React.useState(3);

  return (
    <Pagination>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            iconOnly
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          />
        </Pagination.Item>
        <Pagination.Item>
          <span className="text-muted-foreground px-2 text-sm tabular-nums">
            Page {page} of {TOTAL_PAGES}
          </span>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next
            iconOnly
            disabled={page === TOTAL_PAGES}
            onClick={() => setPage((current) => Math.min(TOTAL_PAGES, current + 1))}
          />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
