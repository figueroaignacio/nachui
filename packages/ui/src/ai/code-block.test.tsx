import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './code-block';

const SAMPLE = ['const a = 1;', 'const b = 2;', 'const c = a + b;'].join('\n');

function Block(props: Partial<React.ComponentProps<typeof CodeBlock>>) {
  return (
    <CodeBlock code={SAMPLE} language="ts" {...props}>
      <CodeBlock.CopyButton />
      <CodeBlock.Content />
      <CodeBlock.Expand />
    </CodeBlock>
  );
}

describe('CodeBlock', () => {
  const writeText = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText } });
    writeText.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders every line and exposes the language', () => {
    const { container } = render(<Block />);
    expect(container.firstElementChild).toHaveAttribute('data-language', 'ts');
    expect(screen.getByText('const c = a + b;')).toBeInTheDocument();
  });

  it('copies the code and flips its label for a moment', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<Block />);
    const button = screen.getByRole('button', { name: 'Copy code' });
    await userEvent.click(button);
    expect(writeText).toHaveBeenCalledWith(SAMPLE);
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
    vi.advanceTimersByTime(1600);
    expect(await screen.findByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  });

  it('renders line numbers when asked', () => {
    const { container } = render(<Block showLineNumbers />);
    expect(container.querySelectorAll('[data-line-number]')).toHaveLength(3);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('collapses past maxLines and expands on click', async () => {
    render(<Block collapsible maxLines={2} />);
    expect(screen.queryByText('const c = a + b;')).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Show 1 more line' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(screen.getByText('const c = a + b;')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('hides the expand toggle when the code fits', () => {
    render(<Block collapsible maxLines={10} />);
    expect(screen.queryByRole('button', { name: /more line/ })).not.toBeInTheDocument();
  });

  it('lets a highlighter render each line', () => {
    render(
      <CodeBlock code={SAMPLE} renderLine={(line) => <mark>{line}</mark>}>
        <CodeBlock.Content />
      </CodeBlock>,
    );
    expect(screen.getByText('const a = 1;').tagName).toBe('MARK');
  });
});
