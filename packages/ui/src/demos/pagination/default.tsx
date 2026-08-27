'use client';

import * as React from 'react';
import { Pagination } from '../../components/pagination';

const TOTAL_PAGES = 8;

function pageList(current: number): (number | 'ellipsis')[] {
  const pages = new Set([1, TOTAL_PAGES, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= TOTAL_PAGES)
    .sort((a, b) => a - b);

  const result: (number | 'ellipsis')[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous > 1) result.push('ellipsis');
    result.push(page);
    previous = page;
  }
  return result;
}

export function Default() {
  const [page, setPage] = React.useState(4);

  return (
    <Pagination>
      <Pagination.Content className="flex-wrap justify-center">
        <Pagination.Item>
          <Pagination.Previous
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="max-sm:w-9 max-sm:px-0 max-sm:[&>span]:sr-only"
          />
        </Pagination.Item>
        {pageList(page).map((item, index) =>
          item === 'ellipsis' ? (
            <Pagination.Item key={`ellipsis-${index}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={item}>
              <Pagination.Link isActive={item === page} onClick={() => setPage(item)}>
                {item}
              </Pagination.Link>
            </Pagination.Item>
          ),
        )}
        <Pagination.Item>
          <Pagination.Next
            disabled={page === TOTAL_PAGES}
            onClick={() => setPage((current) => Math.min(TOTAL_PAGES, current + 1))}
            className="max-sm:w-9 max-sm:px-0 max-sm:[&>span]:sr-only"
          />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
