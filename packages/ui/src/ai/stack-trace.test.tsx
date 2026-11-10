import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { parseStack, StackTrace } from './stack-trace';

const STACK = `TypeError: Cannot read properties of undefined (reading 'amount')
    at applyDiscount (src/checkout/total.ts:42:11)
    at async getTotal (src/checkout/total.ts:18:5)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at Object.<anonymous> (node_modules/vitest/dist/runner.js:120:9)
    at src/checkout/index.ts:7:3`;

describe('parseStack', () => {
  it('reads the name, the message and V8 frames', () => {
    const parsed = parseStack(STACK);
    expect(parsed.name).toBe('TypeError');
    expect(parsed.message).toBe("Cannot read properties of undefined (reading 'amount')");
    expect(parsed.frames).toHaveLength(5);
    expect(parsed.frames[0]).toEqual({
      fn: 'applyDiscount',
      file: 'src/checkout/total.ts',
      line: 42,
      column: 11,
      internal: false,
    });
    expect(parsed.frames[1]?.fn).toBe('getTotal');
    expect(parsed.frames[2]?.internal).toBe(true);
    expect(parsed.frames[3]?.internal).toBe(true);
    expect(parsed.frames[4]).toMatchObject({ fn: undefined, file: 'src/checkout/index.ts' });
  });

  it('reads Firefox frames', () => {
    const parsed = parseStack('applyDiscount@src/checkout/total.ts:42:11\n@src/index.ts:7:3');
    expect(parsed.frames).toEqual([
      { fn: 'applyDiscount', file: 'src/checkout/total.ts', line: 42, column: 11, internal: false },
      { fn: undefined, file: 'src/index.ts', line: 7, column: 3, internal: false },
    ]);
  });

  it('falls back to Error when the first line has no name', () => {
    expect(parseStack('something broke')).toEqual({
      name: 'Error',
      message: 'something broke',
      frames: [],
    });
  });
});

describe('StackTrace', () => {
  function Example(props: { onFrameSelect?: (frame: unknown) => void }) {
    return (
      <StackTrace stack={STACK}>
        <StackTrace.Header>
          <StackTrace.CopyButton />
        </StackTrace.Header>
        <StackTrace.Frames {...props} />
      </StackTrace>
    );
  }

  it('shows the error and hides internal frames, and passes axe', async () => {
    const { container } = render(<Example />);
    expect(screen.getByText('TypeError')).toBeInTheDocument();
    expect(screen.getByText(/Cannot read properties/)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByTitle('src/checkout/total.ts:42:11')).toHaveTextContent(
      'src/checkout/total.ts:42:11',
    );
    expect(screen.getByText('total.ts:42:11')).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('reveals internal frames on demand', async () => {
    render(<Example />);
    const toggle = screen.getByRole('button', { name: 'Show 2 internal frames' });
    await userEvent.click(toggle);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveTextContent('Hide internal frames');
  });

  it('makes app frames selectable', async () => {
    const onFrameSelect = vi.fn();
    render(<Example onFrameSelect={onFrameSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /applyDiscount/ }));
    expect(onFrameSelect).toHaveBeenCalledWith(
      expect.objectContaining({ file: 'src/checkout/total.ts', line: 42 }),
    );
  });

  it('copies the raw stack', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.assign(navigator, { clipboard: { writeText } });
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy stack trace' }));
    expect(writeText).toHaveBeenCalledWith(STACK);
  });

  it('accepts frames as data and rebuilds the text to copy', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.assign(navigator, { clipboard: { writeText } });
    render(
      <StackTrace
        name="RangeError"
        message="Out of range"
        frames={[{ fn: 'f', file: 'a.ts', line: 1 }]}
      >
        <StackTrace.Header>
          <StackTrace.CopyButton />
        </StackTrace.Header>
        <StackTrace.Frames />
      </StackTrace>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Copy stack trace' }));
    expect(writeText).toHaveBeenCalledWith('RangeError: Out of range\n    at f (a.ts:1)');
  });
});
