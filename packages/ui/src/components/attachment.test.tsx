import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '../../test-utils/axe';
import { Attachment, formatFileSize } from './attachment';

describe('formatFileSize', () => {
  it('formats byte counts', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
  });

  it('keeps fractional byte counts in bytes', () => {
    expect(formatFileSize(0.5)).toBe('0.5 B');
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

  it('names the progressbar after the file, or a fallback label', () => {
    const { rerender } = render(
      <Attachment status="uploading">
        <Attachment.Name>video.mp4</Attachment.Name>
        <Attachment.Progress value={10} />
      </Attachment>,
    );
    expect(screen.getByRole('progressbar', { name: 'video.mp4' })).toBeInTheDocument();

    rerender(
      <Attachment status="uploading">
        <Attachment.Progress value={10} />
      </Attachment>,
    );
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toBeInTheDocument();

    rerender(
      <Attachment status="uploading">
        <Attachment.Name>video.mp4</Attachment.Name>
        <Attachment.Progress value={10} aria-label="Sending video" />
      </Attachment>,
    );
    expect(screen.getByRole('progressbar', { name: 'Sending video' })).toBeInTheDocument();
  });

  it('describes each action with its file name', () => {
    render(
      <Attachment.List>
        <Attachment.Item>
          <Attachment>
            <Attachment.Name>first.pdf</Attachment.Name>
            <Attachment.Remove />
          </Attachment>
        </Attachment.Item>
        <Attachment.Item>
          <Attachment>
            <Attachment.Name>second.pdf</Attachment.Name>
            <Attachment.Download href="/second.pdf" />
          </Attachment>
        </Attachment.Item>
      </Attachment.List>,
    );
    expect(screen.getByRole('button', { name: 'Remove attachment' })).toHaveAccessibleDescription(
      'first.pdf',
    );
    expect(screen.getByRole('link', { name: 'Download attachment' })).toHaveAccessibleDescription(
      'second.pdf',
    );
  });

  it('announces upload status in text, not just color', () => {
    const { container, rerender } = render(
      <Attachment status="uploading">
        <Attachment.Name>a.png</Attachment.Name>
      </Attachment>,
    );
    const root = container.querySelector('[data-slot="attachment"]');
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Uploading');

    rerender(
      <Attachment status="error" statusLabels={{ error: 'Could not upload' }}>
        <Attachment.Name>a.png</Attachment.Name>
      </Attachment>,
    );
    expect(root).not.toHaveAttribute('aria-busy');
    expect(screen.getByRole('status')).toHaveTextContent('Could not upload');

    rerender(
      <Attachment status="done">
        <Attachment.Name>a.png</Attachment.Name>
      </Attachment>,
    );
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('gives chip actions a 24px base size', () => {
    render(
      <Attachment variant="chip">
        <Attachment.Remove />
      </Attachment>,
    );
    expect(screen.getByRole('button')).toHaveClass('size-6');
  });

  it('has no axe violations while uploading', async () => {
    const { container } = render(
      <Attachment status="uploading">
        <Attachment.Preview type="application/pdf" name="deck.pdf" />
        <Attachment.Content>
          <Attachment.Name>deck.pdf</Attachment.Name>
          <Attachment.Size bytes={2048} />
        </Attachment.Content>
        <Attachment.Actions>
          <Attachment.Remove />
        </Attachment.Actions>
        <Attachment.Progress value={30} />
      </Attachment>,
    );
    await expectNoAxeViolations(container);
  });
});
