'use client';

import { useState } from 'react';
import { FileTree, type FileChange } from '../../ai/file-tree';

const FILES: FileChange[] = [
  { path: 'src/checkout/total.ts', status: 'modified', additions: 12, deletions: 3 },
  { path: 'src/checkout/total.test.ts', status: 'modified', additions: 18 },
  { path: 'src/checkout/round.ts', status: 'added', additions: 9 },
  { path: 'src/checkout/legacy-round.ts', status: 'deleted', deletions: 14 },
  { path: 'src/app/api/checkout/route.ts', status: 'modified', additions: 2, deletions: 2 },
  { path: 'CHANGELOG.md', status: 'modified', additions: 3 },
];

export function Default() {
  const [selected, setSelected] = useState('src/checkout/total.ts');

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <FileTree files={FILES} selected={selected} onFileSelect={setSelected} />
      <p className="text-muted-foreground font-mono text-xs">{selected}</p>
    </div>
  );
}
