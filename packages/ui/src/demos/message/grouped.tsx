'use client';

import { Avatar } from '../../components/avatar';
import { Bubble } from '../../components/bubble';
import { Message } from '../../components/message';

export function Grouped() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message.Group>
        <Message align="start">
          <Message.Avatar>
            <Avatar size="sm">
              <Avatar.Fallback>LR</Avatar.Fallback>
            </Avatar>
          </Message.Avatar>
          <Message.Content>
            <Message.Header>
              <span className="text-foreground font-medium">Lucia</span>
              <span>09:12</span>
            </Message.Header>
            <Bubble.Group align="start">
              <Bubble variant="secondary">
                <Bubble.Content>Morning! Quick heads up.</Bubble.Content>
              </Bubble>
              <Bubble variant="secondary">
                <Bubble.Content>The registry sync job finished without errors.</Bubble.Content>
              </Bubble>
              <Bubble variant="secondary">
                <Bubble.Content>All five new components are live.</Bubble.Content>
              </Bubble>
            </Bubble.Group>
          </Message.Content>
        </Message>
      </Message.Group>
      <Message align="end">
        <Message.Content>
          <Bubble align="end">
            <Bubble.Content>Great, closing the ticket.</Bubble.Content>
          </Bubble>
          <Message.Footer>
            <span>09:15</span>
          </Message.Footer>
        </Message.Content>
      </Message>
    </div>
  );
}
