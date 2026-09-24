import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chat, type ChatMessage, toChatMessages } from './chat';

const THREAD: ChatMessage[] = [
  { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'Which element folds a tool call?' }] },
  {
    id: 'a1',
    role: 'assistant',
    parts: [
      { type: 'text', text: 'Tool. It shows the status, the input and the output.' },
      { type: 'code', code: "import { Tool } from '@/components/ui/tool';", language: 'tsx' },
      { type: 'tool', name: 'get_projects', status: 'complete', input: { locale: 'en' } },
      { type: 'sources', items: [{ href: 'https://nachui.tech/docs', title: 'NachUI docs' }] },
    ],
  },
];

describe('Chat', () => {
  it('renders user and assistant messages with their parts', () => {
    render(<Chat messages={THREAD} onSend={vi.fn()} />);
    expect(screen.getByText('Which element folds a tool call?')).toBeInTheDocument();
    expect(
      screen.getByText('Tool. It shows the status, the input and the output.'),
    ).toBeInTheDocument();
    expect(screen.getByText('get_projects')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Used 1 source' })).toBeInTheDocument();
  });

  it('shows the empty state with suggestions and forwards a pick', async () => {
    const onSuggestion = vi.fn();
    render(
      <Chat
        messages={[]}
        onSend={vi.fn()}
        suggestions={['What is NachUI?']}
        onSuggestion={onSuggestion}
      />,
    );
    expect(screen.getByText('Start a conversation')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'What is NachUI?' }));
    expect(onSuggestion).toHaveBeenCalledWith('What is NachUI?');
  });

  it('sends the composer text', async () => {
    const onSend = vi.fn();
    render(<Chat messages={[]} onSend={onSend} />);
    await userEvent.type(screen.getByPlaceholderText('Ask anything…'), 'hello{Enter}');
    expect(onSend).toHaveBeenCalledWith({ text: 'hello', files: [] });
  });

  it('shows the skeleton while a reply is pending', () => {
    render(<Chat messages={[THREAD[0] as ChatMessage]} status="submitted" onSend={vi.fn()} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('calls retry and feedback with the message id', async () => {
    const onRetry = vi.fn();
    const onFeedback = vi.fn();
    render(<Chat messages={THREAD} onSend={vi.fn()} onRetry={onRetry} onFeedback={onFeedback} />);
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await userEvent.click(screen.getByRole('button', { name: 'Bad answer' }));
    expect(onRetry).toHaveBeenCalledWith('a1');
    expect(onFeedback).toHaveBeenCalledWith('a1', 'down');
  });

  it('maps ui messages through the adapter', () => {
    const mapped = toChatMessages([
      {
        id: 'm1',
        role: 'assistant',
        parts: [
          { type: 'text', text: 'Here you go.' },
          { type: 'tool-get_projects', state: 'output-available', input: { a: 1 }, output: [1] },
          { type: 'source-url', url: 'https://nachui.tech', title: 'NachUI' },
          { type: 'source-url', url: 'https://nachui.tech/docs' },
        ],
      },
    ]);
    expect(mapped).toEqual([
      {
        id: 'm1',
        role: 'assistant',
        parts: [
          { type: 'text', text: 'Here you go.' },
          { type: 'tool', name: 'get_projects', status: 'complete', input: { a: 1 }, output: [1] },
          {
            type: 'sources',
            items: [
              { href: 'https://nachui.tech', title: 'NachUI' },
              { href: 'https://nachui.tech/docs', title: 'https://nachui.tech/docs' },
            ],
          },
        ],
      },
    ]);
  });
});
