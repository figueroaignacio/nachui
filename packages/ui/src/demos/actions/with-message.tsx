'use client';

import { Actions } from '../../ai/actions';
import { Bubble } from '../../components/bubble';
import { Message } from '../../components/message';

const ANSWER = 'Done. I moved the open state up to the root and the region follows it.';

export function WithMessage() {
  return (
    <div className="w-full max-w-md">
      <Message>
        <Message.Content>
          <Message.Header>Assistant</Message.Header>
          <Bubble variant="secondary">
            <Bubble.Content>{ANSWER}</Bubble.Content>
          </Bubble>
          <Message.Footer className="px-0">
            <Actions>
              <Actions.Copy text={ANSWER} />
              <Actions.Button label="Retry">
                <Actions.Icons.retry />
              </Actions.Button>
              <Actions.Button label="Share">
                <Actions.Icons.share />
              </Actions.Button>
            </Actions>
          </Message.Footer>
        </Message.Content>
      </Message>
    </div>
  );
}
