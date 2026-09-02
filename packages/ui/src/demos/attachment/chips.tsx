'use client';

import { Attachment01Icon, SentIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { Attachment } from '../../components/attachment';
import { Button } from '../../components/button';
import { Textarea } from '../../components/textarea';

const initial = [
  { id: 'spec', name: 'checkout-spec.md', type: 'text/markdown', size: 18_400 },
  { id: 'flow', name: 'payment-flow.png', type: 'image/png', size: 402_000 },
  { id: 'log', name: 'stripe-webhook.log', type: 'text/plain', size: 96_000 },
];

export function Chips() {
  const [files, setFiles] = React.useState(initial);

  return (
    <div className="border-border bg-card flex w-full max-w-md flex-col gap-3 rounded-xl border p-3">
      <Textarea
        aria-label="Message"
        placeholder="Write a message to the payments team"
        autoResize
        maxRows={5}
        className="border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      {files.length > 0 && (
        <Attachment.List layout="inline">
          {files.map((file) => (
            <Attachment.Item key={file.id}>
              <Attachment variant="chip">
                <Attachment.Preview type={file.type} name={file.name} />
                <Attachment.Content>
                  <Attachment.Name>{file.name}</Attachment.Name>
                  <Attachment.Size bytes={file.size} />
                </Attachment.Content>
                <Attachment.Remove
                  onClick={() => setFiles((current) => current.filter((f) => f.id !== file.id))}
                />
              </Attachment>
            </Attachment.Item>
          ))}
        </Attachment.List>
      )}
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm">
          <HugeiconsIcon icon={Attachment01Icon} size={16} />
          Attach
        </Button>
        <Button type="button" size="sm">
          Send
          <HugeiconsIcon icon={SentIcon} size={16} />
        </Button>
      </div>
    </div>
  );
}
