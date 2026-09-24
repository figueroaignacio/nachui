'use client';

import { useState } from 'react';
import { Confirm } from '../../hybrids/confirm';

const PROJECT = 'ignaciofigueroa.dev';

export function WithText() {
  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <Confirm
        title={`Transfer ${PROJECT}`}
        description="Ownership moves to the other team and you lose access to the settings."
        variant="destructive"
        confirmText="Transfer"
        requireText={PROJECT}
        onConfirm={() => setResult(`${PROJECT} transferred.`)}
        onCancel={() => setResult('Nothing changed.')}
      >
        <Confirm.Trigger className="border-border hover:bg-muted rounded-md border px-3 py-1.5 text-sm transition-colors">
          Transfer project
        </Confirm.Trigger>
      </Confirm>
      {result && <p className="text-muted-foreground text-xs">{result}</p>}
    </div>
  );
}
