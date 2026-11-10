import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Queue } from './queue';

function Example({ onRemove }: { onRemove?: () => void }) {
  return (
    <Queue>
      <Queue.Section>
        <Queue.SectionTrigger count={2}>Queued</Queue.SectionTrigger>
        <Queue.List>
          <Queue.Item
            description="After the tests pass"
            actions={
              <Queue.ItemAction label="Remove" onClick={onRemove}>
                x
              </Queue.ItemAction>
            }
          >
            Open the pull request
          </Queue.Item>
          <Queue.Item>Update the changelog</Queue.Item>
        </Queue.List>
      </Queue.Section>
      <Queue.Section defaultOpen={false}>
        <Queue.SectionTrigger count={1}>Done</Queue.SectionTrigger>
        <Queue.List>
          <Queue.Item done>Reproduce the failure</Queue.Item>
        </Queue.List>
      </Queue.Section>
    </Queue>
  );
}

describe('Queue', () => {
  it('lists queued items with their count and passes axe', async () => {
    const { container } = render(<Example />);
    const trigger = screen.getByRole('button', { name: /Queued/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveTextContent('2');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('After the tests pass')).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('opens a closed section and marks done items', async () => {
    render(<Example />);
    const done = screen.getByRole('button', { name: /Done/ });
    expect(done).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(done);
    const item = await screen.findByText('Reproduce the failure');
    expect(item.closest('li')).toHaveAttribute('data-state', 'done');
    expect(item.closest('li')).toHaveTextContent('Reproduce the failure, Done');
  });

  it('runs an item action by its label', async () => {
    const onRemove = vi.fn();
    render(<Example onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
