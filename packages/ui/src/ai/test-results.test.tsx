import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { TestResults } from './test-results';

function Example() {
  return (
    <TestResults summary={{ passed: 12, failed: 1, skipped: 2 }}>
      <TestResults.Header duration="4.2s">checkout</TestResults.Header>
      <TestResults.Summary />
      <TestResults.Suites>
        <TestResults.Suite name="total.test.ts" status="failed">
          <TestResults.Test name="sums line items" duration="3ms" />
          <TestResults.Test name="applies the discount before tax" status="failed">
            <TestResults.Error>Expected 107.10, received 107.09</TestResults.Error>
          </TestResults.Test>
        </TestResults.Suite>
        <TestResults.Suite name="cart.test.ts">
          <TestResults.Test name="adds an item" />
        </TestResults.Suite>
      </TestResults.Suites>
    </TestResults>
  );
}

describe('TestResults', () => {
  it('shows the counts as a description list and passes axe', async () => {
    const { container } = render(<Example />);
    const terms = screen.getAllByRole('term').map((term) => term.textContent);
    const values = screen.getAllByRole('definition').map((value) => value.textContent);
    expect(terms).toEqual(['Passed', 'Failed', 'Skipped']);
    expect(values).toEqual(['12', '1', '2']);
    expect(container.firstChild).toHaveAttribute('data-failed', '');
    expect(screen.getByText('4.2s')).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('opens failed suites and keeps passing ones closed', () => {
    render(<Example />);
    expect(screen.getByRole('button', { name: 'total.test.ts, Failed' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'cart.test.ts, Passed' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByText('Expected 107.10, received 107.09')).toBeInTheDocument();
    expect(screen.queryByText('adds an item')).not.toBeInTheDocument();
  });

  it('expands a suite on click', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'cart.test.ts, Passed' }));
    expect(await screen.findByText('adds an item')).toBeInTheDocument();
  });

  it('renders no summary without counts', () => {
    const { container } = render(
      <TestResults>
        <TestResults.Summary />
      </TestResults>,
    );
    expect(container.querySelector('[data-slot="test-results-summary"]')).toBeNull();
  });
});
