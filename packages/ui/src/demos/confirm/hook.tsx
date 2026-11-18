'use client';

import { useState } from 'react';
import { ConfirmProvider, useConfirm } from '../../hybrids/confirm';

function ArchiveButton() {
  const confirm = useConfirm();
  const [status, setStatus] = useState('Three drafts in the archive.');

  const archive = async () => {
    const ok = await confirm({
      title: 'Archive the draft?',
      description: 'It leaves the list but stays searchable.',
      confirmText: 'Archive',
    });
    setStatus(ok ? 'Archived. Four drafts in the archive.' : 'Still in the list.');
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={() => void archive()}
        className="bg-card hover:bg-muted rounded-md px-3 py-1.5 text-sm shadow-sm transition-colors"
      >
        Archive draft
      </button>
      <p className="text-muted-foreground text-xs">{status}</p>
    </div>
  );
}

export function Hook() {
  return (
    <ConfirmProvider>
      <div className="w-full max-w-md">
        <ArchiveButton />
      </div>
    </ConfirmProvider>
  );
}
