'use client';

import { Conversation } from '../../ai/conversation';
import { Bubble } from '../../components/bubble';
import { Message } from '../../components/message';

const THREAD = [
  { role: 'user', text: 'Which component do I use for an agent run?' },
  {
    role: 'assistant',
    text: 'Task. One per step, each with a status, and Task.File for the files it touched.',
  },
  { role: 'user', text: 'And for the model thinking out loud?' },
  {
    role: 'assistant',
    text: 'Reasoning. It opens while the stream runs and folds away once the answer starts.',
  },
  { role: 'user', text: 'How do I show the files a user attached?' },
  {
    role: 'assistant',
    text: 'Attachments, as a grid, a row of chips or a list. The composer already uses it.',
  },
  { role: 'user', text: 'Can I keep the thread pinned to the latest message?' },
  {
    role: 'assistant',
    text: 'That is this component. Scroll up and a button appears to bring you back down.',
  },
] as const;

export function Default() {
  return (
    <div className="border-border h-72 w-full max-w-md overflow-hidden rounded-xl border">
      <Conversation className="h-full">
        <Conversation.Content>
          {THREAD.map((message, index) => (
            <Message key={index} align={message.role === 'user' ? 'end' : 'start'}>
              <Message.Content>
                <Bubble variant={message.role === 'user' ? 'default' : 'muted'}>
                  <Bubble.Content>{message.text}</Bubble.Content>
                </Bubble>
              </Message.Content>
            </Message>
          ))}
        </Conversation.Content>
        <Conversation.ScrollButton />
      </Conversation>
    </div>
  );
}
