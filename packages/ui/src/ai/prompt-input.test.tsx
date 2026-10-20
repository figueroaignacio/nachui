import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { PromptInput, type PromptInputMessage } from './prompt-input';

function stubPointer(coarse: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query === '(pointer: coarse)' ? coarse : false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
}

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
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

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

  it('keeps the draft when onSubmit returns false', async () => {
    render(
      <PromptInput onSubmit={() => false}>
        <PromptInput.Textarea placeholder="Ask anything" />
      </PromptInput>,
    );
    const textarea = screen.getByPlaceholderText('Ask anything');
    await userEvent.type(textarea, 'Keep me{Enter}');
    expect(textarea).toHaveValue('Keep me');
  });

  it('gives the textarea a default accessible name', async () => {
    const { container } = render(<Composer />);
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('turns the submit button into a stop button while streaming', async () => {
    const onStop = vi.fn();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInput.Textarea placeholder="Ask anything" />
        <PromptInput.Submit status="streaming" onStop={onStop} />
      </PromptInput>,
    );
    const stop = screen.getByRole('button', { name: 'Stop generating' });
    expect(stop).toHaveAttribute('type', 'button');
    await userEvent.click(stop);
    expect(onStop).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit on Enter while streaming or disabled', async () => {
    const onSubmit = vi.fn();
    const { rerender } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInput.Textarea placeholder="Ask anything" />
        <PromptInput.Submit status="streaming" />
      </PromptInput>,
    );
    const textarea = screen.getByPlaceholderText('Ask anything');
    await userEvent.type(textarea, 'Hello{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
    rerender(
      <PromptInput onSubmit={onSubmit} disabled>
        <PromptInput.Textarea placeholder="Ask anything" />
        <PromptInput.Submit />
      </PromptInput>,
    );
    expect(textarea).toBeDisabled();
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('ignores the Enter that commits an IME composition', () => {
    const onSubmit = vi.fn();
    render(<Composer onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText('Ask anything');
    fireEvent.change(textarea, { target: { value: 'konnichiwa' } });
    fireEvent.keyDown(textarea, { key: 'Enter', keyCode: 229 });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps Enter as a newline on touch screens unless told otherwise', () => {
    stubPointer(true);
    const onSubmit = vi.fn();
    const { rerender } = render(<Composer onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText('Ask anything');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
    rerender(
      <PromptInput onSubmit={onSubmit}>
        <PromptInput.Textarea placeholder="Ask anything" submitOnEnter />
      </PromptInput>,
    );
    const sending = screen.getByPlaceholderText('Ask anything');
    expect(sending).toHaveAttribute('enterkeyhint', 'send');
    fireEvent.change(sending, { target: { value: 'Hello' } });
    fireEvent.keyDown(sending, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('keeps object URLs of submitted files alive for the consumer', async () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:notes');
    const onSubmit = vi.fn();
    const { unmount } = render(<Composer onSubmit={onSubmit} accept="text/plain" multiple />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(['hello'], 'notes.txt', { type: 'text/plain' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ files: [expect.objectContaining({ url: 'blob:notes' })] }),
    );
    expect(screen.queryByText('notes.txt')).not.toBeInTheDocument();
    unmount();
    expect(revoke).not.toHaveBeenCalled();
  });

  it('revokes object URLs of files left behind on unmount', async () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:draft');
    const { unmount } = render(<Composer accept="text/plain" multiple />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(['hello'], 'draft.txt', { type: 'text/plain' }));
    unmount();
    expect(revoke).toHaveBeenCalledWith('blob:draft');
  });

  it('keeps both chips when the same file is added twice', async () => {
    render(<Composer accept="text/plain" multiple />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain', lastModified: 1 });
    await userEvent.upload(input, file);
    await userEvent.upload(input, file);
    expect(screen.getAllByRole('button', { name: 'Remove notes.txt' })).toHaveLength(2);
    await userEvent.click(screen.getAllByRole('button', { name: 'Remove notes.txt' })[0]!);
    expect(screen.getAllByRole('button', { name: 'Remove notes.txt' })).toHaveLength(1);
  });

  it('moves focus to the next chip, then the textarea, after a removal', async () => {
    render(<Composer accept="text/plain" multiple />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, [
      new File(['a'], 'a.txt', { type: 'text/plain' }),
      new File(['b'], 'b.txt', { type: 'text/plain' }),
    ]);
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.txt' }));
    expect(screen.getByRole('button', { name: 'Remove b.txt' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Remove b.txt' }));
    expect(screen.getByPlaceholderText('Ask anything')).toHaveFocus();
  });
});
