import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '../../test-utils/axe';
import { Accordion } from './accordion';

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

function renderSingle() {
  return render(
    <Accordion type="single">
      <Accordion.Item value="item-1">
        <Accordion.Trigger value="item-1">Is it accessible?</Accordion.Trigger>
        <Accordion.Content value="item-1">Yes.</Accordion.Content>
      </Accordion.Item>
    </Accordion>,
  );
}

describe('Accordion', () => {
  it('renders closed by default', () => {
    render(
      <Accordion type="single">
        <Accordion.Item value="item-1">
          <Accordion.Trigger value="item-1">Is it accessible?</Accordion.Trigger>
          <Accordion.Content value="item-1">
            Yes. It adheres to the WAI-ARIA design pattern.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: /Is it accessible?/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const content = screen.queryByText('Yes. It adheres to the WAI-ARIA design pattern.');
    expect(content).not.toBeInTheDocument();
  });

  it('toggles accordion content when clicked in single mode', async () => {
    render(
      <Accordion type="single">
        <Accordion.Item value="item-1">
          <Accordion.Trigger value="item-1">Is it accessible?</Accordion.Trigger>
          <Accordion.Content value="item-1">Yes.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger value="item-2">Is it unstyled?</Accordion.Trigger>
          <Accordion.Content value="item-2">No.</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );

    const trigger1 = screen.getByRole('button', { name: /Is it accessible?/i });
    const trigger2 = screen.getByRole('button', { name: /Is it unstyled?/i });

    await userEvent.click(trigger1);

    await waitFor(() => {
      expect(screen.getByText('Yes.')).toBeInTheDocument();
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    });

    await userEvent.click(trigger2);

    await waitFor(() => {
      expect(screen.queryByText('Yes.')).not.toBeInTheDocument();
      expect(screen.getByText('No.')).toBeInTheDocument();
      expect(trigger1).toHaveAttribute('aria-expanded', 'false');
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('allows multiple open items in multiple mode', async () => {
    render(
      <Accordion type="multiple">
        <Accordion.Item value="item-1">
          <Accordion.Trigger value="item-1">Is it accessible?</Accordion.Trigger>
          <Accordion.Content value="item-1">Yes.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger value="item-2">Is it unstyled?</Accordion.Trigger>
          <Accordion.Content value="item-2">No.</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );

    const trigger1 = screen.getByRole('button', { name: /Is it accessible?/i });
    const trigger2 = screen.getByRole('button', { name: /Is it unstyled?/i });

    await userEvent.click(trigger1);
    await userEvent.click(trigger2);

    await waitFor(() => {
      expect(screen.getByText('Yes.')).toBeInTheDocument();
      expect(screen.getByText('No.')).toBeInTheDocument();
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('wraps each trigger in a heading, level 3 by default', () => {
    renderSingle();
    const heading = screen.getByRole('heading', { level: 3, name: 'Is it accessible?' });
    expect(heading).toContainElement(screen.getByRole('button', { name: 'Is it accessible?' }));
  });

  it('lets the root and the trigger choose the heading level', () => {
    render(
      <Accordion headingLevel={2}>
        <Accordion.Item value="a">
          <Accordion.Trigger value="a">From root</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger value="b" headingLevel={4}>
            From trigger
          </Accordion.Trigger>
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'From root' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'From trigger' })).toBeInTheDocument();
  });

  it('only points aria-controls at the content while it is mounted', async () => {
    renderSingle();
    const trigger = screen.getByRole('button', { name: 'Is it accessible?' });
    expect(trigger).not.toHaveAttribute('aria-controls');

    await userEvent.click(trigger);
    const region = screen.getByRole('region');
    expect(trigger).toHaveAttribute('aria-controls', region.id);
  });

  it('still rotates the chevron with reduced motion, without animating it', async () => {
    motionState.reduced = true;
    const { container } = renderSingle();
    const chevron = container.querySelector('svg');
    expect(chevron).toHaveAttribute('data-animate', '"closed"');

    await userEvent.click(screen.getByRole('button', { name: 'Is it accessible?' }));
    expect(chevron).toHaveAttribute('data-animate', '"open"');
    expect(chevron).toHaveAttribute('data-transition', JSON.stringify({ duration: 0 }));
  });

  it('has no axe violations open or closed', async () => {
    const { container } = renderSingle();
    await expectNoAxeViolations(container);
    await userEvent.click(screen.getByRole('button', { name: 'Is it accessible?' }));
    await expectNoAxeViolations(container);
  });
});
