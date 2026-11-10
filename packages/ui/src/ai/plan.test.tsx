import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Plan } from './plan';

function Example(props: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Plan {...props}>
      <Plan.Header title="Fix the checkout test" completed={2} total={4} />
      <Plan.Content>
        <Plan.Step status="complete">Reproduce the failure</Plan.Step>
        <Plan.Step status="complete">Find the rounding bug</Plan.Step>
        <Plan.Step status="active" description="pnpm test checkout">
          Run the checkout suite
        </Plan.Step>
        <Plan.Step status="skipped">Update the snapshot</Plan.Step>
      </Plan.Content>
    </Plan>
  );
}

describe('Plan', () => {
  it('renders an ordered list of steps with their status and passes axe', async () => {
    const { container } = render(<Example />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent('Reproduce the failure, Done');
    expect(items[2]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).toHaveTextContent('pnpm test checkout');
    expect(items[3]).toHaveAttribute('data-status', 'skipped');
    await expectNoAxeViolations(container);
  });

  it('shows progress in the header and reads it in words', () => {
    render(<Example />);
    const header = screen.getByRole('button', { name: /Fix the checkout test/ });
    expect(header).toHaveTextContent('2/4');
    expect(header).toHaveTextContent('2 of 4 done');
    expect(header.querySelector('[data-slot="plan-progress"]')).toHaveStyle({ width: '50%' });
  });

  it('collapses and expands from the header', async () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    const header = screen.getByRole('button', { name: /Fix the checkout test/ });
    expect(header).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(header);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  it('hides the progress when no total is given', () => {
    render(
      <Plan>
        <Plan.Header title="Plan" />
      </Plan>,
    );
    expect(screen.getByRole('button', { name: 'Plan' })).not.toHaveTextContent('/');
  });
});
