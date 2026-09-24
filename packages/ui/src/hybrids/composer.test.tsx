import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Composer } from './composer';

const MODELS = [
  { id: 'flash', label: 'Gemini 2.5 Flash' },
  { id: 'pro', label: 'Gemini 2.5 Pro' },
];

describe('Composer', () => {
  it('sends the typed text on Enter with no files', async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} placeholder="Ask anything" />);
    await userEvent.type(screen.getByPlaceholderText('Ask anything'), 'hello{Enter}');
    expect(onSend).toHaveBeenCalledWith({ text: 'hello', files: [] });
  });

  it('adds a newline on Shift+Enter instead of sending', async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} placeholder="Ask anything" />);
    await userEvent.type(
      screen.getByPlaceholderText('Ask anything'),
      'line{Shift>}{Enter}{/Shift}two',
    );
    expect(onSend).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Ask anything')).toHaveValue('line\ntwo');
  });

  it('disables send while the input is empty', () => {
    render(<Composer onSend={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  });

  it('swaps send for stop while streaming and calls onStop', async () => {
    const onStop = vi.fn();
    render(<Composer onSend={vi.fn()} onStop={onStop} status="streaming" />);
    expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('sends a suggestion when clicked', async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} suggestions={['What is NachUI?']} />);
    await userEvent.click(screen.getByRole('button', { name: 'What is NachUI?' }));
    expect(onSend).toHaveBeenCalledWith({ text: 'What is NachUI?', files: [] });
  });

  it('fills the input with a suggestion when sendOnSuggestion is off', async () => {
    const onSend = vi.fn();
    render(
      <Composer
        onSend={onSend}
        suggestions={['Explain the CLI']}
        sendOnSuggestion={false}
        placeholder="Ask anything"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Explain the CLI' }));
    expect(onSend).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Ask anything')).toHaveValue('Explain the CLI');
  });

  it('shows the current model and reports a change', async () => {
    const onModelChange = vi.fn();
    render(
      <Composer onSend={vi.fn()} models={MODELS} model="flash" onModelChange={onModelChange} />,
    );
    const trigger = screen.getByRole('button', { name: 'Model' });
    expect(trigger).toHaveTextContent('Gemini 2.5 Flash');
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByText('Gemini 2.5 Pro'));
    expect(onModelChange).toHaveBeenCalledWith('pro');
  });

  it('renders the context meter when given', () => {
    render(<Composer onSend={vi.fn()} context={{ used: 12400, max: 128000 }} />);
    expect(screen.getByLabelText(/tokens used/)).toBeInTheDocument();
  });

  it('clears the input on Escape', async () => {
    render(<Composer onSend={vi.fn()} placeholder="Ask anything" />);
    const input = screen.getByPlaceholderText('Ask anything');
    await userEvent.type(input, 'draft{Escape}');
    expect(input).toHaveValue('');
  });

  it('follows a controlled value', () => {
    const { rerender } = render(<Composer onSend={vi.fn()} value="one" placeholder="Ask" />);
    expect(screen.getByPlaceholderText('Ask')).toHaveValue('one');
    rerender(<Composer onSend={vi.fn()} value="two" placeholder="Ask" />);
    expect(screen.getByPlaceholderText('Ask')).toHaveValue('two');
  });
});
