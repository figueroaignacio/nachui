'use client';

import { Typography } from '../../components/typography';

const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export function Headings() {
  return (
    <div className="flex w-full flex-col gap-4">
      {headings.map((heading) => (
        <Typography key={heading} variant={heading}>
          Heading {heading.replace('h', '')}
        </Typography>
      ))}
    </div>
  );
}
