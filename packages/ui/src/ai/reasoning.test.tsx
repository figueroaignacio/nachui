import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Reasoning } from './reasoning';

describe('Reasoning', () => {
  it('is open by default', () => {
    render(
      <Reasoning>
        <Reasoning.Trigger />
        <Reasoning.Content>Because the user asked for it.</Reasoning.Content>
      </Reasoning>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Because the user asked for it.')).toBeInTheDocument();
  });

  it('labels the trigger with the duration', () => {
    render(
      <Reasoning duration={4}>
        <Reasoning.Trigger />
      </Reasoning>,
    );
    expect(screen.getByRole('button', { name: /Thought for 4 seconds/ })).toBeInTheDocument();
  });

  it('says it is thinking while streaming', () => {
    render(
      <Reasoning isStreaming>
        <Reasoning.Trigger />
      </Reasoning>,
    );
    expect(screen.getByRole('button', { name: /Thinking/ })).toBeInTheDocument();
  });

  it('opens on its own while streaming', () => {
    render(
      <Reasoning isStreaming defaultOpen={false}>
        <Reasoning.Trigger />
        <Reasoning.Content>Streamed thought</Reasoning.Content>
      </Reasoning>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('accepts a custom label', () => {
    render(
      <Reasoning duration={2}>
        <Reasoning.Trigger getLabel={(streaming, duration) => `took ${duration}s`} />
      </Reasoning>,
    );
    expect(screen.getByRole('button', { name: /took 2s/ })).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    render(
      <Reasoning>
        <Reasoning.Trigger />
        <Reasoning.Content>Hidden soon</Reasoning.Content>
      </Reasoning>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });
});
