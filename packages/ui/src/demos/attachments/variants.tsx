'use client';

import { Attachments, type AttachmentData } from '../../ai/attachments';

const FILES: AttachmentData[] = [
  { id: '1', filename: 'hero.png', mediaType: 'image/png', size: 184320 },
  { id: '2', filename: 'spec.pdf', mediaType: 'application/pdf', size: 62400 },
];

export function Variants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      {(['grid', 'inline', 'list'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-muted-foreground font-mono text-[11px]">{variant}</span>
          <Attachments variant={variant}>
            {FILES.map((file) => (
              <Attachments.Item key={file.id} data={file}>
                <Attachments.Preview />
                <Attachments.Info showMediaType={variant === 'list'} />
                <Attachments.Remove />
              </Attachments.Item>
            ))}
          </Attachments>
        </div>
      ))}
    </div>
  );
}
