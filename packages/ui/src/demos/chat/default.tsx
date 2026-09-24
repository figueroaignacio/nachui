'use client';

import { Chat, type ChatMessage } from '../../hybrids/chat';

const THREAD: ChatMessage[] = [
  {
    id: 'u1',
    role: 'user',
    parts: [{ type: 'text', text: 'How do I show a tool call inside a message?' }],
  },
  {
    id: 'a1',
    role: 'assistant',
    parts: [
      { type: 'reasoning', text: 'The question is about rendering, not about running the tool.' },
      {
        type: 'text',
        text: 'Use Tool. It folds the call into a card with its status, and opens to show the input and the output.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `<Tool status="complete">
  <Tool.Header name="get_projects" />
  <Tool.Content>
    <Tool.Input value={{ locale: 'en' }} />
    <Tool.Output value={projects} />
  </Tool.Content>
</Tool>`,
      },
    ],
  },
  { id: 'u2', role: 'user', parts: [{ type: 'text', text: 'Show me one with real data.' }] },
  {
    id: 'a2',
    role: 'assistant',
    parts: [
      {
        type: 'tool',
        name: 'get_projects',
        status: 'complete',
        input: { locale: 'en', limit: 2 },
        output: [
          { slug: 'nachui', title: 'NachUI' },
          { slug: 'portfolio', title: 'ignaciofigueroa.dev' },
        ],
      },
      { type: 'text', text: 'Two projects came back. The card above is the call itself.' },
      {
        type: 'sources',
        items: [
          { href: 'https://nachui.tech/docs/elements/ai/tool', title: 'Tool · NachUI' },
          {
            href: 'https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage',
            title: 'Chatbot tool usage',
          },
        ],
      },
    ],
  },
];

export function Default() {
  return (
    <div className="border-border h-[28rem] w-full max-w-2xl overflow-hidden rounded-xl border">
      <Chat
        messages={THREAD}
        onSend={() => {}}
        onRetry={() => {}}
        onFeedback={() => {}}
        suggestions={['What is NachUI?', 'Show me the composer']}
      />
    </div>
  );
}
