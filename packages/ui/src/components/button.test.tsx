import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '../../test-utils/axe';
import { Button } from './button';

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
            'data-variants': props.variants ? JSON.stringify(props.variants) : undefined,
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

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
  });

  it('shows loading state with aria-disabled and keeps focus', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { rerender } = render(<Button onClick={handleClick}>Submit</Button>);
    const button = screen.getByRole('button');
    button.focus();

    rerender(
      <Button onClick={handleClick} loading>
        Submit
      </Button>,
    );
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toBeDisabled();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not submit its form while loading', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          Save
        </Button>
      </form>,
    );
    screen.getByRole('button').click();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps native disabled for the disabled prop only', () => {
    render(
      <Button disabled loading>
        Off
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute('aria-disabled');
  });

  it('swaps the loader with opacity only under reduced motion', () => {
    motionState.reduced = true;
    const { container } = render(<Button loading>Saving</Button>);
    const animated = Array.from(container.querySelectorAll('[data-variants]'));
    expect(animated).toHaveLength(2);
    for (const node of animated) {
      const variants = JSON.parse(node.getAttribute('data-variants') ?? '{}') as Record<
        string,
        Record<string, unknown>
      >;
      for (const state of Object.values(variants)) {
        expect(Object.keys(state)).toEqual(['opacity']);
      }
    }
    expect(container.querySelector('svg')).toHaveClass('motion-reduce:animate-none');
  });

  it('has no axe violations while loading', async () => {
    const { container } = render(<Button loading>Saving</Button>);
    await expectNoAxeViolations(container);
  });

  it('renders left and right icons', () => {
    render(
      <Button
        leftIcon={<span data-testid="left">Left</span>}
        rightIcon={<span data-testid="right">Right</span>}
      >
        Icon Button
      </Button>,
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('applies variants correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-destructive');
  });
});
