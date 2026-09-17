import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Context, formatTokens } from './context';

describe('Context', () => {
  it('shows the used percentage on the trigger', () => {
    render(
      <Context maxTokens={100000} usedTokens={45000}>
        <Context.Trigger />
      </Context>,
    );
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('describes the budget to screen readers', () => {
    render(
      <Context maxTokens={200000} usedTokens={84320}>
        <Context.Trigger />
      </Context>,
    );
    expect(screen.getByRole('button', { name: '84K of 200K tokens used' })).toBeInTheDocument();
  });

  it('keeps the panel closed until it is opened', async () => {
    render(
      <Context maxTokens={100000} usedTokens={45000}>
        <Context.Trigger />
        <Context.Content>
          <Context.Body>
            <Context.Usage label="Input" tokens={30000} />
          </Context.Body>
        </Context.Content>
      </Context>,
    );
    expect(screen.queryByText('Input')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Input')).toBeInTheDocument();
  });

  it('caps the percentage at 100', () => {
    render(
      <Context maxTokens={100} usedTokens={400}>
        <Context.Trigger />
      </Context>,
    );
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('formats tokens in a compact form', () => {
    expect(formatTokens(820)).toBe('820');
    expect(formatTokens(4200)).toBe('4.2K');
    expect(formatTokens(84320)).toBe('84K');
    expect(formatTokens(2400000)).toBe('2.4M');
  });
});
