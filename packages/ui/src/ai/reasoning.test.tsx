import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
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
        <Reasoning.Trigger getLabel={(_streaming, duration) => `took ${duration}s`} />
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

  it('points aria-controls at the content only while it is open', async () => {
    const { container } = render(
      <Reasoning>
        <Reasoning.Trigger />
        <Reasoning.Content>Shown</Reasoning.Content>
      </Reasoning>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('region').id);
    await expectNoAxeViolations(container);
    await userEvent.click(trigger);
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('collapses when streaming ends', () => {
    const { rerender } = render(
      <Reasoning isStreaming>
        <Reasoning.Trigger />
      </Reasoning>,
    );
    rerender(
      <Reasoning isStreaming={false}>
        <Reasoning.Trigger />
      </Reasoning>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('stays open when streaming ends while focus is inside', () => {
    const { rerender } = render(
      <Reasoning isStreaming>
        <Reasoning.Trigger />
      </Reasoning>,
    );
    screen.getByRole('button').focus();
    rerender(
      <Reasoning isStreaming={false}>
        <Reasoning.Trigger />
      </Reasoning>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('stays open when streaming ends while the pointer is over it', () => {
    const { rerender, container } = render(
      <Reasoning isStreaming>
        <Reasoning.Trigger />
      </Reasoning>,
    );
    fireEvent.pointerEnter(container.firstElementChild as HTMLElement);
    rerender(
      <Reasoning isStreaming={false}>
        <Reasoning.Trigger />
      </Reasoning>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
});
