import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload, formatBytes, useFileUploadContext } from './file-upload';

function makeFile(name: string, size: number, type = 'text/plain') {
  const file = new File(['x'.repeat(Math.min(size, 8))], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

function getInput(): HTMLInputElement {
  const input = document.querySelector('input[type="file"]');
  if (!input) throw new Error('file input not rendered');
  return input as HTMLInputElement;
}

function Count() {
  const { files } = useFileUploadContext();
  return <span data-testid="count">{files.length}</span>;
}

describe('formatBytes', () => {
  it('formats sizes with the right unit', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5 MB');
  });
});

describe('FileUpload', () => {
  it('renders a hidden file input and a dropzone', () => {
    render(
      <FileUpload accept="image/*" multiple>
        <FileUpload.Dropzone>Drop files</FileUpload.Dropzone>
      </FileUpload>,
    );
    const input = getInput();
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('multiple');
    expect(screen.getByRole('button', { name: 'Drop files' })).toBeInTheDocument();
  });

  it('opens the file dialog from the dropzone and the trigger', async () => {
    const user = userEvent.setup();
    render(
      <FileUpload>
        <FileUpload.Dropzone>Drop</FileUpload.Dropzone>
        <FileUpload.Trigger>Browse</FileUpload.Trigger>
      </FileUpload>,
    );
    const click = vi.spyOn(getInput(), 'click');
    await user.click(screen.getByRole('button', { name: 'Drop' }));
    await user.click(screen.getByRole('button', { name: 'Browse' }));
    expect(click).toHaveBeenCalledTimes(2);
  });

  it('lists selected files with name and size, and removes them', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(
      <FileUpload multiple onFilesChange={onFilesChange}>
        <FileUpload.Dropzone>Drop</FileUpload.Dropzone>
        <FileUpload.List />
      </FileUpload>,
    );

    await user.upload(getInput(), [makeFile('report.pdf', 2048, 'application/pdf')]);

    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByText('2 KB')).toBeInTheDocument();
    expect(onFilesChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ file: expect.objectContaining({ name: 'report.pdf' }) }),
    ]);

    await user.click(screen.getByRole('button', { name: 'Remove file' }));
    expect(screen.queryByText('report.pdf')).not.toBeInTheDocument();
    expect(onFilesChange).toHaveBeenLastCalledWith([]);
  });

  it('replaces the previous file in single mode', async () => {
    const user = userEvent.setup();
    render(
      <FileUpload>
        <FileUpload.Dropzone>Drop</FileUpload.Dropzone>
        <FileUpload.List />
        <Count />
      </FileUpload>,
    );
    await user.upload(getInput(), makeFile('one.txt', 10));
    await user.upload(getInput(), makeFile('two.txt', 10));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByText('two.txt')).toBeInTheDocument();
  });

  it('rejects files over maxSize and reports the error', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    render(
      <FileUpload maxSize={1024} onError={onError}>
        <FileUpload.Dropzone>Drop</FileUpload.Dropzone>
        <FileUpload.List />
        <FileUpload.Errors />
      </FileUpload>,
    );
    await user.upload(getInput(), makeFile('big.zip', 4096, 'application/zip'));
    expect(screen.getByRole('alert')).toHaveTextContent(
      '"big.zip" exceeds the maximum size of 1 KB.',
    );
    expect(screen.queryByText('big.zip', { selector: 'span' })).not.toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith(['"big.zip" exceeds the maximum size of 1 KB.']);
  });

  it('rejects files that do not match accept', async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(
      <FileUpload accept=".pdf,image/*">
        <FileUpload.Dropzone>Drop</FileUpload.Dropzone>
        <FileUpload.Errors />
        <Count />
      </FileUpload>,
    );
    await user.upload(getInput(), makeFile('notes.txt', 10, 'text/plain'));
    expect(screen.getByRole('alert')).toHaveTextContent(
      '"notes.txt" is not an accepted file type.',
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('enforces maxFiles across batches', async () => {
    const user = userEvent.setup();
    render(
      <FileUpload multiple maxFiles={2}>
        <FileUpload.Dropzone>Drop</FileUpload.Dropzone>
        <FileUpload.Errors />
        <Count />
      </FileUpload>,
    );
    await user.upload(getInput(), [makeFile('a.txt', 1), makeFile('b.txt', 1)]);
    await user.upload(getInput(), [makeFile('c.txt', 1)]);
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByRole('alert')).toHaveTextContent('You can upload a maximum of 2 files.');
  });

  it('accepts dropped files and tracks the dragging state', () => {
    render(
      <FileUpload multiple>
        <FileUpload.Dropzone>Drop</FileUpload.Dropzone>
        <Count />
      </FileUpload>,
    );
    const dropzone = screen.getByRole('button', { name: 'Drop' });
    const files = [makeFile('photo.png', 100, 'image/png')];

    fireEvent.dragEnter(dropzone, { dataTransfer: { items: [{}], files } });
    expect(dropzone).toHaveAttribute('data-dragging');

    fireEvent.drop(dropzone, { dataTransfer: { items: [{}], files } });
    expect(dropzone).not.toHaveAttribute('data-dragging');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('shows initial files and clears them', async () => {
    const user = userEvent.setup();
    render(
      <FileUpload
        multiple
        initialFiles={[
          { id: 'seed', name: 'brief.pdf', size: 3072, type: 'application/pdf', url: '/brief.pdf' },
        ]}
      >
        <FileUpload.List />
        <FileUpload.Clear>Clear</FileUpload.Clear>
      </FileUpload>,
    );
    expect(screen.getByText('brief.pdf')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryByText('brief.pdf')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('does nothing while disabled', async () => {
    const user = userEvent.setup();
    render(
      <FileUpload disabled>
        <FileUpload.Dropzone>Drop</FileUpload.Dropzone>
        <FileUpload.Trigger>Browse</FileUpload.Trigger>
      </FileUpload>,
    );
    const dropzone = screen.getByRole('button', { name: 'Drop' });
    expect(dropzone).toHaveAttribute('aria-disabled', 'true');
    expect(dropzone).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'Browse' })).toBeDisabled();
    const click = vi.spyOn(getInput(), 'click');
    await user.click(dropzone);
    expect(click).not.toHaveBeenCalled();
  });
});
