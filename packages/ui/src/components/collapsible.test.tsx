import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '../../test-utils/axe';
import { Collapsible } from './collapsible';

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock('motion/react', async () => {
  const mock = await import('../../__mocks__/motion/react');
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        const cached = cache.get(tag);
        if (cached) return cached;
        const Base = mock.motion[tag] as React.FC<Record<string, unknown>>;
        const Component: React.FC<Record<string, unknown>> = (props) =>
          React.createElement(Base, {
            ...props,
            'data-animate': JSON.stringify(props.animate ?? null),
            'data-transition': JSON.stringify(props.transition ?? null),
          });
        cache.set(tag, Component);
        return Component;
      },
    },
  );
  return { ...mock, motion, useReducedMotion: () => motionState.reduced };
});

afterEach(() => {
  motionState.reduced = false;
});

describe('Collapsible', () => {
  it('renders closed by default', () => {
    render(
      <Collapsible>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content inside</Collapsible.Content>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: /Toggle/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Content inside')).not.toBeInTheDocument();
  });

  it('toggles content on click', async () => {
    render(
      <Collapsible>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content inside</Collapsible.Content>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: /Toggle/i });

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Content inside')).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.queryByText('Content inside')).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('respects defaultOpen prop', () => {
    render(
      <Collapsible defaultOpen>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content inside</Collapsible.Content>
      </Collapsible>,
    );

    expect(screen.getByText('Content inside')).toBeInTheDocument();
  });

  it('keeps force-mounted content hidden and inert while closed', async () => {
    render(
      <Collapsible>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content forceMount>
          <a href="#inside">Inside link</a>
        </Collapsible.Content>
      </Collapsible>,
    );

    const content = screen.getByText('Inside link').closest('[role="region"]');
    expect(content).toHaveAttribute('hidden');
    expect(content).toHaveAttribute('inert');
    expect(content).toHaveAttribute('data-animate', '"closed"');

    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(content).not.toHaveAttribute('hidden');
    expect(content).not.toHaveAttribute('inert');
    expect(content).toHaveAttribute('data-animate', '"open"');

    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(content).toHaveAttribute('inert');
    expect(content).toHaveAttribute('data-animate', '"closed"');
  });

  it('still rotates the chevron with reduced motion, without animating it', async () => {
    motionState.reduced = true;
    render(
      <Collapsible>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Body</Collapsible.Content>
      </Collapsible>,
    );
    const trigger = screen.getByRole('button', { name: 'Toggle' });
    const chevron = trigger.querySelector('span[aria-hidden="true"]');
    expect(chevron).toHaveAttribute('data-animate', JSON.stringify({ rotate: 0 }));

    await userEvent.click(trigger);
    expect(chevron).toHaveAttribute('data-animate', JSON.stringify({ rotate: 180 }));
    expect(chevron).toHaveAttribute('data-transition', JSON.stringify({ duration: 0 }));
  });

  it('forwards the ref and sets type="button" on an asChild trigger', async () => {
    const ref = React.createRef<HTMLButtonElement>();
    const childRef = React.createRef<HTMLButtonElement>();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Collapsible>
          <Collapsible.Trigger asChild ref={ref}>
            <button ref={childRef}>Custom</button>
          </Collapsible.Trigger>
          <Collapsible.Content>Body</Collapsible.Content>
        </Collapsible>
      </form>,
    );

    const trigger = screen.getByRole('button', { name: 'Custom' });
    expect(ref.current).toBe(trigger);
    expect(childRef.current).toBe(trigger);
    expect(trigger).toHaveAttribute('type', 'button');

    await userEvent.click(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('has no axe violations when open', async () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Body</Collapsible.Content>
      </Collapsible>,
    );
    await expectNoAxeViolations(container);
  });
});
