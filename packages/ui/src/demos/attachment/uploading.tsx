'use client';

import * as React from 'react';
import { Attachment } from '../../components/attachment';

const uploads = [
  { name: 'customer-export.csv', type: 'text/csv', size: 12_600_000, speed: 9 },
  { name: 'onboarding.mp4', type: 'video/mp4', size: 148_000_000, speed: 3 },
  { name: 'contract-v3.pdf', type: 'application/pdf', size: 820_000, speed: 0, failed: true },
];

export function Uploading() {
  const [progress, setProgress] = React.useState(() => uploads.map(() => 0));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((current) =>
        current.map((value, index) => {
          const upload = uploads[index];
          if (!upload || upload.failed) return value;
          return Math.min(value + upload.speed, 100);
        }),
      );
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <Attachment.List className="w-full max-w-sm">
      {uploads.map((upload, index) => {
        const value = progress[index] ?? 0;
        const status = upload.failed ? 'error' : value >= 100 ? 'done' : 'uploading';

        return (
          <Attachment.Item key={upload.name}>
            <Attachment status={status}>
              <Attachment.Preview type={upload.type} name={upload.name} />
              <Attachment.Content>
                <Attachment.Name>{upload.name}</Attachment.Name>
                <Attachment.Meta>
                  {status === 'error' && (
                    <span className="text-destructive">Upload failed, try again</span>
                  )}
                  {status === 'uploading' && (
                    <>
                      {Math.round(value)}% of <Attachment.Size bytes={upload.size} />
                    </>
                  )}
                  {status === 'done' && <Attachment.Size bytes={upload.size} />}
                </Attachment.Meta>
              </Attachment.Content>
              <Attachment.Actions>
                <Attachment.Remove
                  aria-label={status === 'uploading' ? 'Cancel upload' : 'Remove'}
                />
              </Attachment.Actions>
              {status === 'uploading' && <Attachment.Progress value={value} />}
            </Attachment>
          </Attachment.Item>
        );
      })}
    </Attachment.List>
  );
}
