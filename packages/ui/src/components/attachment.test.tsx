import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Attachment, formatFileSize } from './attachment';

describe('formatFileSize', () => {
  it('formats byte counts', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
  });
});

describe('Attachment', () => {
  it('renders name, size and an image preview', () => {
    render(
      <Attachment>
        <Attachment.Preview src="/hero.png" name="hero.png" />
        <Attachment.Content>
          <Attachment.Name>hero.png</Attachment.Name>
          <Attachment.Size bytes={2048} />
        </Attachment.Content>
      </Attachment>,
    );
    expect(screen.getByText('hero.png')).toBeInTheDocument();
    expect(screen.getByText('2 KB')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'hero.png' })).toHaveAttribute('src', '/hero.png');
  });

  it('falls back to a type icon without a source', () => {
    const { container } = render(
      <Attachment>
        <Attachment.Preview type="application/pdf" name="deck.pdf" />
      </Attachment>,
    );
    const preview = container.querySelector('[data-slot="attachment-preview"]');
    expect(preview).toHaveAttribute('data-kind', 'icon');
    expect(preview?.querySelector('svg')).not.toBeNull();
  });

  it('calls onClick from the remove button', async () => {
    const onRemove = vi.fn();
    render(
      <Attachment>
        <Attachment.Remove onClick={onRemove} />
      </Attachment>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove attachment' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('reflects variant and status as data attributes', () => {
    const { container } = render(
      <Attachment variant="chip" status="error">
        <Attachment.Name>broken.zip</Attachment.Name>
      </Attachment>,
    );
    const root = container.querySelector('[data-slot="attachment"]');
    expect(root).toHaveAttribute('data-variant', 'chip');
    expect(root).toHaveAttribute('data-status', 'error');
  });

  it('exposes progress as a progressbar', () => {
    render(
      <Attachment status="uploading">
        <Attachment.Progress value={42} />
      </Attachment>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');
  });
});
