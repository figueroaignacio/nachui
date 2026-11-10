'use client';

import { Checkpoint } from '@repo/ui/ai/checkpoint';
import { Conversation } from '@repo/ui/ai/conversation';
import { Shimmer } from '@repo/ui/ai/shimmer';
import type { UIMessage } from 'ai';
import * as React from 'react';
import type { VersionSummary } from '@/lib/types';
import { AssistantMessage, UserMessage } from './message-parts';

export function ChatThread({
  messages,
  versions,
  currentVersion,
  running,
  waiting,
  onRestore,
  footer,
}: {
  messages: UIMessage[];
  versions: VersionSummary[];
  currentVersion: number;
  running: boolean;
  waiting: boolean;
  onRestore?: (version: number) => void;
  footer?: React.ReactNode;
}) {
  const byMessage = React.useMemo(
    () => new Map(versions.filter((v) => v.messageId).map((v) => [v.messageId as string, v])),
    [versions],
  );
  const lastId = messages.at(-1)?.id;

  return (
    <Conversation className="min-h-0 flex-1" label="Chat with the Studio">
      <Conversation.Content className="gap-4 px-4 py-5">
        {messages.length === 0 && !waiting ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            Describe the screen you want and the Studio builds it with NachUI.
          </p>
        ) : null}
        {messages.map((message) => {
          if (message.role === 'user') return <UserMessage key={message.id} message={message} />;
          if (message.role !== 'assistant') return null;
          const version = byMessage.get(message.id);
          return (
            <React.Fragment key={message.id}>
              <AssistantMessage message={message} streaming={running && message.id === lastId} />
              {version ? (
                <Checkpoint
                  label={`v${version.number}${version.number === currentVersion ? ' · current' : ''}`}
                  onRestore={
                    onRestore && version.number !== currentVersion && !running
                      ? () => onRestore(version.number)
                      : undefined
                  }
                />
              ) : null}
            </React.Fragment>
          );
        })}
        {waiting ? <Shimmer className="text-sm">Reading the catalog</Shimmer> : null}
        {footer}
      </Conversation.Content>
      <Conversation.ScrollButton />
    </Conversation>
  );
}
