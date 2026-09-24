import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentRun, agentRunProgress, type AgentStep } from './agent-run';

const STEPS: AgentStep[] = [
  {
    id: 'read',
    title: 'Read the auth module',
    status: 'complete',
    detail: 'Scanned 12 files',
    files: ['auth.service.ts'],
  },
  {
    id: 'plan',
    title: 'Plan the refactor',
    status: 'complete',
    reasoning: 'The session store and the token store can share one interface.',
  },
  {
    id: 'write',
    title: 'Rewrite the session store',
    status: 'active',
    detail: 'Writing the adapter',
    tools: [
      {
        id: 'write-file',
        name: 'write_file',
        status: 'complete',
        input: { path: 'session-store.ts' },
        output: 'ok',
      },
    ],
  },
  { id: 'test', title: 'Run the tests', status: 'pending' },
];

describe('AgentRun', () => {
  it('renders the title and the status label', () => {
    render(<AgentRun title="Refactoring the auth module" status="running" steps={STEPS} />);
    expect(screen.getByText('Refactoring the auth module')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('opens the active step and keeps a finished one closed', () => {
    render(<AgentRun status="running" steps={STEPS} />);
    const active = screen.getByRole('button', { name: /Rewrite the session store/ });
    const finished = screen.getByRole('button', { name: /Read the auth module/ });
    expect(active).toHaveAttribute('aria-expanded', 'true');
    expect(finished).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Writing the adapter')).toBeInTheDocument();
    expect(screen.queryByText('Scanned 12 files')).not.toBeInTheDocument();
  });

  it('renders the tools of an open step with their name and output', () => {
    render(<AgentRun status="running" steps={STEPS} />);
    const tool = screen.getByRole('button', { name: /write_file/ });
    expect(tool).toBeInTheDocument();
  });

  it('reports progress through the bar', () => {
    render(<AgentRun status="running" steps={STEPS} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(bar).toHaveAttribute('aria-valuemax', '4');
    expect(bar).toHaveAttribute('aria-label', '2 of 4 steps');
  });

  it('shows a skeleton while running without an answer', () => {
    const { container, rerender } = render(<AgentRun status="running" steps={STEPS} />);
    expect(container.querySelector('[data-response-skeleton]')).not.toBeNull();
    expect(container.querySelector('[aria-busy]')).toBeNull();
    rerender(<AgentRun status="complete" steps={STEPS} />);
    expect(container.querySelector('[data-response-skeleton]')).toBeNull();
  });

  it('renders the answer once it exists and marks it streaming while running', () => {
    const { rerender } = render(
      <AgentRun status="running" steps={STEPS} answer={<p>All done</p>} />,
    );
    const answer = screen.getByText('All done');
    expect(answer.closest('[aria-busy="true"]')).not.toBeNull();
    rerender(<AgentRun status="complete" steps={STEPS} answer={<p>All done</p>} />);
    expect(screen.getByText('All done').closest('[aria-busy="true"]')).toBeNull();
  });

  it('renders usage in the footer', () => {
    render(<AgentRun status="complete" steps={STEPS} usage={{ used: 12000, max: 200000 }} />);
    const footer = screen.getByText('2 of 4 steps').parentElement as HTMLElement;
    expect(within(footer).getByRole('button', { name: /tokens used/ })).toBeInTheDocument();
  });

  it('computes progress', () => {
    expect(agentRunProgress(STEPS)).toEqual({ done: 2, total: 4, ratio: 0.5 });
    expect(agentRunProgress([])).toEqual({ done: 0, total: 0, ratio: 0 });
  });
});
