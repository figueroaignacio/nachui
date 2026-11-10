import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Terminal } from './terminal';

const lines = (count: number) =>
  Array.from({ length: count }, (_, index) => `line ${index + 1}`).join('\n');

function Example({ output }: { output: string }) {
  return (
    <Terminal command="pnpm build" output={output} status="running" className="w-96">
      <Terminal.Header />
      <Terminal.Content />
    </Terminal>
  );
}

describe('Terminal in a real browser', () => {
  it('follows new output while the reader stays at the bottom', async () => {
    const screen = await render(<Example output={lines(60)} />);
    const output = screen.getByRole('region').element() as HTMLElement;
    const gap = () => output.scrollHeight - output.scrollTop - output.clientHeight;
    expect(output.scrollHeight).toBeGreaterThan(output.clientHeight);
    await expect.poll(gap).toBeLessThan(2);

    await screen.rerender(<Example output={lines(90)} />);
    await expect.poll(() => output.querySelectorAll('[data-line]').length).toBe(90);
    await expect.poll(gap).toBeLessThan(2);
  });

  it('stops following once the reader scrolls up', async () => {
    const screen = await render(<Example output={lines(60)} />);
    const output = screen.getByRole('region').element() as HTMLElement;
    output.scrollTop = 0;
    output.dispatchEvent(new Event('scroll'));

    await screen.rerender(<Example output={lines(90)} />);
    expect(output.scrollTop).toBe(0);
  });
});
