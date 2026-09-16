'use client';

import { Avatar } from '../../components/avatar';
import { Bubble } from '../../components/bubble';
import { Message } from '../../components/message';
import { CopyIcon } from '../../icons/copy';
import { RepeatIcon } from '../../icons/repeat';
import { SparklesIcon } from '../../icons/sparkles';

export function Assistant() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message align="end">
        <Message.Content>
          <Bubble align="end">
            <Bubble.Content>How do I theme the components?</Bubble.Content>
          </Bubble>
        </Message.Content>
      </Message>
      <Message align="start">
        <Message.Avatar>
          <Avatar size="sm">
            <Avatar.Fallback className="bg-primary/10 text-primary">
              <SparklesIcon size={14} />
            </Avatar.Fallback>
          </Avatar>
        </Message.Avatar>
        <Message.Content className="max-w-[85%]">
          <Message.Header>
            <span className="text-foreground font-medium">Assistant</span>
          </Message.Header>
          <Bubble variant="ghost" className="max-w-full">
            <Bubble.Content className="px-0">
              Every color is a CSS variable in globals.css. Override the tokens on :root for light
              mode and on .dark for dark mode, and all the components pick them up. No config file
              involved.
            </Bubble.Content>
          </Bubble>
          <Message.Footer className="gap-2 px-0">
            <button
              type="button"
              aria-label="Copy answer"
              className="hover:text-foreground transition-colors"
            >
              <CopyIcon size={13} />
            </button>
            <button
              type="button"
              aria-label="Regenerate answer"
              className="hover:text-foreground transition-colors"
            >
              <RepeatIcon size={13} />
            </button>
          </Message.Footer>
        </Message.Content>
      </Message>
    </div>
  );
}
