'use client';

import { Avatar } from '../../components/avatar';
import { Bubble } from '../../components/bubble';
import { Message } from '../../components/message';

export function Default() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message align="start">
        <Message.Avatar>
          <Avatar size="sm">
            <Avatar.Fallback>LR</Avatar.Fallback>
          </Avatar>
        </Message.Avatar>
        <Message.Content>
          <Message.Header>
            <span className="text-foreground font-medium">Lucia</span>
            <span>10:24</span>
          </Message.Header>
          <Bubble variant="secondary">
            <Bubble.Content>Can you review the pagination PR today?</Bubble.Content>
          </Bubble>
        </Message.Content>
      </Message>
      <Message align="end">
        <Message.Avatar>
          <Avatar size="sm">
            <Avatar.Fallback>NA</Avatar.Fallback>
          </Avatar>
        </Message.Avatar>
        <Message.Content>
          <Bubble align="end">
            <Bubble.Content>Sure, give me an hour.</Bubble.Content>
          </Bubble>
          <Message.Footer>
            <span>10:26</span>
            <span aria-hidden="true">·</span>
            <span>Read</span>
          </Message.Footer>
        </Message.Content>
      </Message>
    </div>
  );
}
