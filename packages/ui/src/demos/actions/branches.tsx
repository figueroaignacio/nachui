'use client';

import { useState } from 'react';
import { Actions } from '../../ai/actions';
import { Bubble } from '../../components/bubble';
import { Message } from '../../components/message';

const VERSIONS = [
  'Move the open state into a context and read it from each item.',
  'Lift the open state to the root and pass it down as a prop.',
  'Done. I moved the open state up to the root and the region follows it.',
];

export function Branches() {
  const [version, setVersion] = useState(VERSIONS.length - 1);
  const answer = VERSIONS[version] ?? '';

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message align="end">
        <Message.Content>
          <Bubble>
            <Bubble.Content>Where should the open state of the accordion live?</Bubble.Content>
          </Bubble>
          <Message.Footer className="px-0">
            <Actions align="end">
              <Actions.Button label="Edit message">
                <Actions.Icons.edit />
              </Actions.Button>
            </Actions>
          </Message.Footer>
        </Message.Content>
      </Message>
      <Message>
        <Message.Content>
          <Message.Header>Assistant</Message.Header>
          <Bubble variant="secondary">
            <Bubble.Content>{answer}</Bubble.Content>
          </Bubble>
          <Message.Footer className="px-0">
            <Actions>
              <Actions.Branch count={VERSIONS.length} value={version} onValueChange={setVersion} />
              <Actions.Copy text={answer} />
              <Actions.Button label="Retry">
                <Actions.Icons.retry />
              </Actions.Button>
              <Actions.Feedback />
            </Actions>
          </Message.Footer>
        </Message.Content>
      </Message>
    </div>
  );
}
