'use client';

import { useState } from 'react';
import { Attachments, type AttachmentData } from '../../ai/attachments';
import { usePlayback } from '../../lib/use-playback';

const INITIAL: AttachmentData[] = [
  { id: '1', filename: 'design-system.pdf', mediaType: 'application/pdf', size: 248320 },
  { id: '2', filename: 'registry.ts', mediaType: 'text/typescript', size: 12480 },
  { id: '3', filename: 'notes.md', mediaType: 'text/markdown', size: 3120 },
];

export function Default() {
  const [kept, setFiles] = useState(INITIAL);
  const { step, playing, rootProps } = usePlayback(INITIAL.length, 550);
  const files = playing ? INITIAL.slice(0, step) : kept;

  if (files.length === 0 && !playing) {
    return (
      <div {...rootProps} className="w-full max-w-md">
        <Attachments>
          <Attachments.Empty>Everything removed, reload the demo to start over</Attachments.Empty>
        </Attachments>
      </div>
    );
  }

  return (
    <div {...rootProps} className="min-h-28 w-full max-w-md">
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
