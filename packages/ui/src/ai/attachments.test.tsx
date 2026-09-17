import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Attachments, attachmentLabel, formatSize, type AttachmentData } from './attachments';

const FILE: AttachmentData = {
  id: '1',
  filename: 'spec.pdf',
  mediaType: 'application/pdf',
  size: 248320,
};

describe('Attachments', () => {
  it('renders the filename and size', () => {
    render(
      <Attachments>
        <Attachments.Item data={FILE}>
          <Attachments.Preview />
          <Attachments.Info />
        </Attachments.Item>
      </Attachments>,
    );
    expect(screen.getByText('spec.pdf')).toBeInTheDocument();
    expect(screen.getByText('243 KB')).toBeInTheDocument();
  });

  it('shows the media type when asked', () => {
    render(
      <Attachments>
        <Attachments.Item data={FILE}>
          <Attachments.Info showMediaType />
        </Attachments.Item>
      </Attachments>,
    );
    expect(screen.getByText(/application\/pdf/)).toBeInTheDocument();
  });

  it('calls onRemove from the remove button', async () => {
    const onRemove = vi.fn();
    render(
      <Attachments>
        <Attachments.Item data={FILE} onRemove={onRemove}>
          <Attachments.Remove />
        </Attachments.Item>
      </Attachments>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove spec.pdf' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('previews an image by its url', () => {
    render(
      <Attachments>
        <Attachments.Item
          data={{ id: '2', filename: 'hero.png', mediaType: 'image/png', url: '/hero.png' }}
        >
          <Attachments.Preview />
        </Attachments.Item>
      </Attachments>,
    );
    expect(screen.getByRole('img', { name: 'hero.png' })).toHaveAttribute('src', '/hero.png');
  });

  it('carries its variant to the root', () => {
    render(<Attachments variant="list" data-testid="attachments" />);
    expect(screen.getByTestId('attachments')).toHaveAttribute('data-variant', 'list');
  });

  it('renders an empty state', () => {
    render(
      <Attachments>
        <Attachments.Empty />
      </Attachments>,
    );
    expect(screen.getByText('No attachments yet')).toBeInTheDocument();
  });

  it('formats sizes and falls back to the url for a label', () => {
    expect(formatSize(512)).toBe('512 B');
    expect(formatSize(2048)).toBe('2.0 KB');
    expect(attachmentLabel({ id: '3', url: 'https://example.com/a/report.csv' })).toBe(
      'report.csv',
    );
  });
});
