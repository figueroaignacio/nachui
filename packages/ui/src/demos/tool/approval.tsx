'use client';

import { useState } from 'react';
import { Confirmation } from '../../ai/confirmation';
import { Tool, type ToolStatus } from '../../ai/tool';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function Approval() {
  const [status, setStatus] = useState<ToolStatus>('awaiting-approval');

  const describe: Record<string, string> = {
    'awaiting-approval': 'Waiting for your approval',
    running: 'Sending',
    complete: 'Sent to ana@northwind.io',
    denied: 'You denied this call',
  };

  return (
    <div className="w-full max-w-md">
      <Tool status={status}>
        <Tool.Header name="send_contact_email" description={describe[status]} />
        <Tool.Content>
          <Tool.Input value={{ to: 'ana@northwind.io', subject: 'Your invoice for October' }} />
          {status === 'awaiting-approval' ? (
            <Confirmation>
              <Confirmation.Title>Send this email?</Confirmation.Title>
              <Confirmation.Actions>
                <Confirmation.Deny onClick={() => setStatus('denied')} />
                <Confirmation.Approve
                  onClick={async () => {
                    setStatus('running');
                    await wait(1200);
                    setStatus('complete');
                  }}
                >
                  Send
                </Confirmation.Approve>
              </Confirmation.Actions>
            </Confirmation>
          ) : null}
          {status === 'complete' ? (
            <Tool.Output value={{ id: 'msg_8f2c', status: 'sent' }} />
          ) : null}
        </Tool.Content>
      </Tool>
    </div>
  );
}
