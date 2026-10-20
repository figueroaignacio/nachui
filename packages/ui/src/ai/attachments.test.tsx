import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
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

  it('leaves the image alt empty when Info already names the file', async () => {
    const image = { id: '2', filename: 'hero.png', mediaType: 'image/png', url: '/hero.png' };
    const { container } = render(
      <Attachments>
        <Attachments.Item data={image}>
          <Attachments.Preview />
          <Attachments.Info />
        </Attachments.Item>
      </Attachments>,
    );
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
    expect(screen.queryByRole('img', { name: 'hero.png' })).not.toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('uses a label that already names the file as the full label', () => {
    render(
      <Attachments>
        <Attachments.Item data={FILE} onRemove={() => undefined}>
          <Attachments.Remove label="Remove spec.pdf" />
        </Attachments.Item>
        <Attachments.Item data={{ ...FILE, id: '2', filename: 'b.pdf' }}>
          <Attachments.Remove label={(name) => `Quitar ${name}`} />
        </Attachments.Item>
        <Attachments.Item data={{ ...FILE, id: '3', filename: 'c.pdf' }}>
          <Attachments.Remove label="Delete" />
        </Attachments.Item>
      </Attachments>,
    );
    expect(screen.getByRole('button', { name: 'Remove spec.pdf' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar b.pdf' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete c.pdf' })).toBeInTheDocument();
  });

  it('moves focus to the next item, then the previous, then the list after a removal', async () => {
    function List() {
      const [files, setFiles] = React.useState(['a.pdf', 'b.pdf', 'c.pdf']);
      return (
        <Attachments>
          {files.map((filename) => (
            <Attachments.Item
              key={filename}
              data={{ id: filename, filename }}
              onRemove={() => setFiles((current) => current.filter((name) => name !== filename))}
            >
              <Attachments.Info />
              <Attachments.Remove />
            </Attachments.Item>
          ))}
        </Attachments>
      );
    }
    const { container } = render(<List />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove b.pdf' }));
    expect(screen.getByRole('button', { name: 'Remove c.pdf' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Remove c.pdf' }));
    expect(screen.getByRole('button', { name: 'Remove a.pdf' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(container.firstElementChild).toHaveFocus();
  });
});
