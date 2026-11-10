import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Confirmation } from './confirmation';

function Deferred() {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function Run(props: React.ComponentProps<typeof Confirmation> & { onApprove?: () => unknown }) {
  const { onApprove, ...rest } = props;
  return (
    <Confirmation {...rest}>
      <Confirmation.Title>Run pnpm test checkout?</Confirmation.Title>
      <Confirmation.Description>It runs in your repo.</Confirmation.Description>
      <Confirmation.Actions>
        <Confirmation.Deny />
        <Confirmation.Approve onClick={onApprove as () => void} />
      </Confirmation.Actions>
    </Confirmation>
  );
}

describe('Confirmation', () => {
  it('is a named group with the description attached and passes axe', async () => {
    const { container } = render(<Run />);
    const group = screen.getByRole('group', { name: 'Run pnpm test checkout?' });
    expect(group).toHaveAccessibleDescription('It runs in your repo.');
    expect(group).toHaveAttribute('data-state', 'pending');
    await expectNoAxeViolations(container);
  });

  it('approves, hides the buttons and announces the result', async () => {
    const onStateChange = vi.fn();
    render(<Run onStateChange={onStateChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onStateChange).toHaveBeenCalledWith('approved');
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Approved');
  });

  it('denies with its own label', async () => {
    render(<Run deniedLabel="You said no" />);
    await userEvent.click(screen.getByRole('button', { name: 'Deny' }));
    expect(screen.getByRole('group')).toHaveAttribute('data-state', 'denied');
    expect(screen.getByRole('status')).toHaveTextContent('You said no');
  });

  it('waits for an async approval and stays pending if it fails', async () => {
    const first = Deferred();
    const onApprove = vi.fn(() => first.promise);
    render(<Run onApprove={onApprove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(screen.getByRole('group')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Deny' })).toBeDisabled();
    await act(async () => {
      first.reject(new Error('nope'));
      await first.promise.catch(() => undefined);
    });
    expect(screen.getByRole('group')).toHaveAttribute('data-state', 'pending');
    expect(screen.getByRole('button', { name: 'Deny' })).toBeEnabled();
  });

  it('follows a controlled state', () => {
    const { rerender } = render(<Run state="pending" />);
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    rerender(<Run state="approved" />);
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
  });
});
