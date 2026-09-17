'use client';

import { useState } from 'react';
import { Attachments, type AttachmentData } from '../../ai/attachments';

const INITIAL: AttachmentData[] = [
  { id: '1', filename: 'design-system.pdf', mediaType: 'application/pdf', size: 248320 },
  { id: '2', filename: 'registry.ts', mediaType: 'text/typescript', size: 12480 },
  { id: '3', filename: 'notes.md', mediaType: 'text/markdown', size: 3120 },
];

export function Default() {
  const [files, setFiles] = useState(INITIAL);

  if (files.length === 0) {
    return (
      <div className="w-full max-w-md">
        <Attachments>
          <Attachments.Empty>Everything removed, reload the demo to start over</Attachments.Empty>
        </Attachments>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Attachments>
        {files.map((file) => (
          <Attachments.Item
            key={file.id}
            data={file}
            onRemove={() => setFiles((current) => current.filter((item) => item.id !== file.id))}
          >
            <Attachments.Preview />
            <Attachments.Info />
            <Attachments.Remove />
          </Attachments.Item>
        ))}
      </Attachments>
    </div>
  );
}
