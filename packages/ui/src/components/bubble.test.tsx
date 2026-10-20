import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Bubble } from './bubble';

describe('Bubble', () => {
  it('renders content', () => {
    render(
      <Bubble>
        <Bubble.Content>Hello there</Bubble.Content>
      </Bubble>,
    );
    expect(screen.getByText('Hello there')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    render(<Bubble data-testid="bubble">Hi</Bubble>);
    expect(screen.getByTestId('bubble')).toHaveClass('bg-primary');
  });

  it('applies secondary variant classes', () => {
    render(
      <Bubble variant="secondary" data-testid="bubble">
        Hi
      </Bubble>,
    );
    expect(screen.getByTestId('bubble')).toHaveClass('bg-secondary');
  });

  it('applies destructive variant classes', () => {
    render(
      <Bubble variant="destructive" data-testid="bubble">
        Hi
      </Bubble>,
    );
    expect(screen.getByTestId('bubble')).toHaveClass('bg-destructive-surface');
  });

  it('aligns to the end', () => {
    render(
      <Bubble align="end" data-testid="bubble">
        Hi
      </Bubble>,
    );
    expect(screen.getByTestId('bubble')).toHaveClass('self-end');
  });

  it('renders reactions anchored to a side', () => {
    render(
      <Bubble>
        <Bubble.Content>Hi</Bubble.Content>
        <Bubble.Reactions data-testid="reactions" side="top" align="start">
          <span>1</span>
        </Bubble.Reactions>
      </Bubble>,
    );
    const reactions = screen.getByTestId('reactions');
    expect(reactions).toHaveClass('-top-3');
    expect(reactions).toHaveClass('left-2');
  });

  it('groups bubbles with alignment', () => {
    render(
      <Bubble.Group align="end" data-testid="group">
        <Bubble>One</Bubble>
        <Bubble>Two</Bubble>
      </Bubble.Group>,
    );
    expect(screen.getByTestId('group')).toHaveClass('items-end');
  });

  it('renders content as child element', () => {
    render(
      <Bubble>
        <Bubble.Content asChild>
          <a href="https://example.com">A link</a>
        </Bubble.Content>
      </Bubble>,
    );
    const link = screen.getByRole('link', { name: 'A link' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('px-3.5');
  });

  it('forwards the ref and composes handlers when rendering as child', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const childRef = React.createRef<HTMLAnchorElement>();
    const slotClick = vi.fn();
    const childClick = vi.fn();
    render(
      <Bubble>
        <Bubble.Content asChild ref={ref} onClick={slotClick} title="slot" data-slot-prop="">
          <a ref={childRef} href="#reply" onClick={childClick} title="child">
            Reply
          </a>
        </Bubble.Content>
      </Bubble>,
    );

    const link = screen.getByRole('link', { name: 'Reply' });
    expect(ref.current).toBe(link);
    expect(childRef.current).toBe(link);
    expect(link).toHaveAttribute('title', 'child');
    expect(link).toHaveAttribute('data-slot-prop');

    await userEvent.click(link);
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(slotClick).toHaveBeenCalledTimes(1);
  });
});
