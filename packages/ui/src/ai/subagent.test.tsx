import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Subagent, type SubagentStatus } from './subagent';

function Example({ status }: { status?: SubagentStatus }) {
  return (
    <Subagent status={status}>
      <Subagent.Header name="test-runner" task="Run the checkout suite" meta="3 tools · 12s" />
      <Subagent.Content>
        <p>Ran pnpm test checkout</p>
        <Subagent.Result>1 test fails: the discount is applied after tax.</Subagent.Result>
      </Subagent.Content>
    </Subagent>
  );
}

describe('Subagent', () => {
  it('opens while running and passes axe', async () => {
    const { container } = render(<Example status="running" />);
    const header = screen.getByRole('button', { name: /test-runner/ });
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(header).toHaveTextContent('Running');
    expect(screen.getByRole('region', { name: /test-runner/ })).toBeInTheDocument();
    expect(screen.getByText('Returned')).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('stays closed when done and toggles from the header', async () => {
    render(<Example />);
    const header = screen.getByRole('button', { name: /test-runner/ });
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(header).toHaveTextContent('Done');
    expect(screen.queryByText('Ran pnpm test checkout')).not.toBeInTheDocument();
    await userEvent.click(header);
    expect(await screen.findByText('Ran pnpm test checkout')).toBeInTheDocument();
  });

  it('marks the status on the root', () => {
    const { container } = render(<Example status="error" />);
    expect(container.firstChild).toHaveAttribute('data-status', 'error');
    expect(screen.getByRole('button', { name: /Failed/ })).toBeInTheDocument();
  });
});
