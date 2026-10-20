import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
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

  it('announces status changes through a live status pill', () => {
    const { rerender } = render(<AgentRun status="running" steps={STEPS} />);
    const pill = screen.getByText('Running');
    expect(pill).toHaveAttribute('role', 'status');
    expect(pill).toHaveTextContent('Running');
    rerender(<AgentRun status="error" steps={STEPS} />);
    expect(pill).toHaveTextContent('Failed');
    expect(pill).toHaveAttribute('data-status', 'error');
  });

  it('renders the elapsed time from startedAt on the first pass', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(10_000);
      const markup = renderToString(<AgentRun status="running" steps={STEPS} startedAt={5_000} />);
      expect(markup).toContain('>0s<');
      render(<AgentRun status="running" steps={STEPS} startedAt={5_000} />);
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(screen.getByText('5s')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('opens a step when it becomes active or fails, unless the user closed it after', async () => {
    const pending: AgentStep[] = [
      { id: 'one', title: 'Step one', status: 'pending', detail: 'Doing it' },
    ];
    const { rerender } = render(<AgentRun status="running" steps={pending} />);
    const trigger = screen.getByRole('button', { name: /Step one/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    rerender(<AgentRun status="running" steps={[{ ...pending[0]!, status: 'active' }]} />);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    rerender(
      <AgentRun status="running" steps={[{ ...pending[0]!, status: 'active', detail: 'Still' }]} />,
    );
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    rerender(<AgentRun status="error" steps={[{ ...pending[0]!, status: 'error' }]} />);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps steps closed when defaultOpen is false', () => {
    const steps: AgentStep[] = [{ id: 'one', title: 'Step one', status: 'pending' }];
    const { rerender } = render(<AgentRun status="running" steps={steps} defaultOpen={false} />);
    rerender(
      <AgentRun
        status="running"
        steps={[{ ...steps[0]!, status: 'active' }]}
        defaultOpen={false}
      />,
    );
    expect(screen.getByRole('button', { name: /Step one/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('anchors the progress fill to the logical start', () => {
    render(<AgentRun status="running" steps={STEPS} />);
    expect(screen.getByRole('progressbar').firstElementChild).toHaveClass('start-0');
  });

  it('has no axe violations', async () => {
    const { container } = render(<AgentRun title="Run" status="running" steps={STEPS} />);
    await expectNoAxeViolations(container);
  });
});
