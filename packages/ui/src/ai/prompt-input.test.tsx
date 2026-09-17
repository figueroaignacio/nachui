import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromptInput, type PromptInputMessage } from './prompt-input';

function Composer({
  onSubmit,
  ...props
}: { onSubmit?: (message: PromptInputMessage) => void } & Record<string, unknown>) {
  return (
    <PromptInput onSubmit={(message) => onSubmit?.(message)} {...props}>
      <PromptInput.Header>
        <PromptInput.Attachments />
      </PromptInput.Header>
      <PromptInput.Body>
        <PromptInput.Textarea placeholder="Ask anything" />
      </PromptInput.Body>
      <PromptInput.Footer>
        <PromptInput.Tools>
          <PromptInput.AddAttachments />
        </PromptInput.Tools>
        <PromptInput.Submit />
      </PromptInput.Footer>
    </PromptInput>
  );
}

describe('PromptInput', () => {
  it('disables submit until there is something to send', async () => {
    render(<Composer />);
    const submit = screen.getByRole('button', { name: 'Send message' });
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByPlaceholderText('Ask anything'), 'Hello');
    expect(submit).toBeEnabled();
  });

  it('submits the text and clears the field', async () => {
    const onSubmit = vi.fn();
    render(<Composer onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText('Ask anything');
    await userEvent.type(textarea, 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ text: 'Hello', files: [] }));
    expect(textarea).toHaveValue('');
  });

  it('submits on Enter and adds a newline on Shift+Enter', async () => {
    const onSubmit = vi.fn();
    render(<Composer onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText('Ask anything');
    await userEvent.type(textarea, 'One{Shift>}{Enter}{/Shift}Two');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('One\nTwo');
    await userEvent.type(textarea, '{Enter}');
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('does not submit an empty prompt', async () => {
    const onSubmit = vi.fn();
    render(<Composer onSubmit={onSubmit} />);
    await userEvent.type(screen.getByPlaceholderText('Ask anything'), '   {Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows an attached file and removes it', async () => {
    render(<Composer accept="text/plain" multiple />);
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, file);
    expect(screen.getByText('notes.txt')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Remove notes.txt' }));
    expect(screen.queryByText('notes.txt')).not.toBeInTheDocument();
  });

  it('reports a dropped file that does not match accept', () => {
    const onError = vi.fn();
    const { container } = render(<Composer accept="image/*" onError={onError} />);
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    fireEvent.drop(container.querySelector('form') as HTMLFormElement, {
      dataTransfer: { files: [file], types: ['Files'] },
    });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'accept' }));
    expect(screen.queryByText('notes.txt')).not.toBeInTheDocument();
  });

  it('accepts a dropped file that matches accept', () => {
    const { container } = render(<Composer accept="text/plain" multiple />);
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    fireEvent.drop(container.querySelector('form') as HTMLFormElement, {
      dataTransfer: { files: [file], types: ['Files'] },
    });
    expect(screen.getByText('notes.txt')).toBeInTheDocument();
  });

  it('marks the submit button with its status', () => {
    render(
      <PromptInput>
        <PromptInput.Footer>
          <PromptInput.Submit status="streaming" />
        </PromptInput.Footer>
      </PromptInput>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-status', 'streaming');
  });
});
