'use client';

import { useState } from 'react';
import { Confirm } from '../../hybrids/confirm';

function TrashIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function Default() {
  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <Confirm
        title="Delete project"
        description="The repository, its deployments and every environment variable go with it. This cannot be undone."
        icon={<TrashIcon />}
        variant="destructive"
        confirmText="Delete project"
        onConfirm={() =>
          new Promise<void>((resolve) => {
            setTimeout(() => {
              setResult('Deleted.');
              resolve();
            }, 900);
          })
        }
        onCancel={() => setResult('Kept it.')}
      >
        <Confirm.Trigger className="border-border hover:bg-muted rounded-md border px-3 py-1.5 text-sm transition-colors">
          Delete project
        </Confirm.Trigger>
      </Confirm>
      {result && <p className="text-muted-foreground text-xs">{result}</p>}
    </div>
  );
}
