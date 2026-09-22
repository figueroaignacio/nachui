'use client';

import { useEffect, useState } from 'react';
import { Conversation } from '../../ai/conversation';
import { Bubble } from '../../components/bubble';
import { Message } from '../../components/message';

const LINES = [
  'Reading the registry.',
  'Found 58 components across three families.',
  'Matching the request to prompt-input.tsx.',
  'Writing the demo.',
  'Regenerating the registry.',
  'Running the type check.',
  'Done. Two files changed.',
];

export function Streaming() {
  const [running, setRunning] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setMessages((previous) => {
        const next = LINES[previous.length % LINES.length];
        return next ? [...previous, next] : previous;
      });
    }, 900);
    return () => window.clearInterval(interval);
  }, [running]);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setRunning((previous) => !previous)}
          className="border-border hover:bg-muted w-fit rounded-full border px-3 py-1.5 text-xs transition-colors"
        >
          {running ? 'Stop stream' : 'Start stream'}
        </button>
        <button
          type="button"
          onClick={() => setMessages([])}
          className="text-muted-foreground hover:text-foreground px-2 py-1.5 text-xs transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="border-border h-64 w-full overflow-hidden rounded-xl border">
        <Conversation className="h-full">
          {messages.length === 0 ? (
            <Conversation.Empty>
              <span className="text-foreground">Nothing yet</span>
              <span>Start the stream and scroll up to see the thread let go.</span>
            </Conversation.Empty>
          ) : (
            <Conversation.Content>
              {messages.map((text, index) => (
                <Message key={index}>
                  <Message.Content>
                    <Bubble variant="muted">
                      <Bubble.Content>{text}</Bubble.Content>
                    </Bubble>
                  </Message.Content>
                </Message>
              ))}
            </Conversation.Content>
          )}
          <Conversation.ScrollButton />
        </Conversation>
      </div>
    </div>
  );
}
