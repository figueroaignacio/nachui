import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Terminal } from './terminal';

const OUTPUT = '> vitest run src/checkout\n✓ sums line items\n× applies the discount\n';

function Example(props: React.ComponentProps<typeof Terminal>) {
  return (
    <Terminal command="pnpm test checkout" output={OUTPUT} {...props}>
      <Terminal.Header>
        <Terminal.CopyButton />
      </Terminal.Header>
      <Terminal.Content />
    </Terminal>
  );
}

describe('Terminal', () => {
  it('shows the command, the output lines and the exit code, and passes axe', async () => {
    const { container } = render(<Example exitCode={1} duration="4.2s" />);
    expect(screen.getByText('pnpm test checkout')).toBeInTheDocument();
    const output = screen.getByRole('region', { name: 'Output of pnpm test checkout' });
    expect(output.querySelectorAll('[data-line]')).toHaveLength(3);
    expect(screen.getByText('exit 1')).toHaveClass('text-destructive-text');
    expect(screen.getByText('4.2s')).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-failed', '');
    await expectNoAxeViolations(container);
  });

  it('shows a cursor and a busy state while running', () => {
    const { container } = render(<Example status="running" />);
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelector('[data-slot="terminal-cursor"]')).toBeInTheDocument();
    expect(screen.queryByText(/exit/)).not.toBeInTheDocument();
  });

  it('announces when a running command finishes', () => {
    const { rerender } = render(<Example status="running" />);
    expect(screen.getAllByRole('status')[1]).toHaveTextContent('');
    rerender(<Example status="complete" exitCode={0} />);
    expect(screen.getByText('Command finished with exit code 0')).toBeInTheDocument();
    expect(screen.getByText('exit 0')).toHaveClass('text-success-text');
  });

  it('copies the output', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.assign(navigator, { clipboard: { writeText } });
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy output' }));
    expect(writeText).toHaveBeenCalledWith(OUTPUT);
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});
