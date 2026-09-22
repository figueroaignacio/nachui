import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Conversation } from './conversation';

function defineScroll(
  element: HTMLElement,
  scrollTop: number,
  scrollHeight = 1000,
  clientHeight = 300,
) {
  Object.defineProperty(element, 'scrollHeight', { configurable: true, value: scrollHeight });
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: clientHeight });
  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    writable: true,
    value: scrollTop,
  });
}

describe('Conversation', () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo;
  });

  afterEach(() => {
    scrollTo.mockReset();
  });

  it('renders a polite log region', () => {
    render(
      <Conversation>
        <Conversation.Content>Hello</Conversation.Content>
      </Conversation>,
    );
    const log = screen.getByRole('log');
    expect(log).toHaveAttribute('aria-live', 'polite');
    expect(log).toHaveAttribute('data-stuck', 'true');
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders the empty state', () => {
    render(
      <Conversation>
        <Conversation.Empty>Nothing yet</Conversation.Empty>
      </Conversation>,
    );
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
  });

  it('hides the scroll button while stuck to the bottom', () => {
    render(
      <Conversation>
        <Conversation.Content>Hello</Conversation.Content>
        <Conversation.ScrollButton />
      </Conversation>,
    );
    expect(screen.queryByRole('button', { name: 'Scroll to bottom' })).not.toBeInTheDocument();
  });

  it('shows the scroll button after the user scrolls up and reports the change', () => {
    const onStickChange = vi.fn();
    render(
      <Conversation onStickChange={onStickChange}>
        <Conversation.Content>Hello</Conversation.Content>
        <Conversation.ScrollButton />
      </Conversation>,
    );
    const log = screen.getByRole('log');
    defineScroll(log, 100);
    act(() => {
      fireEvent.scroll(log);
    });
    expect(screen.getByRole('button', { name: 'Scroll to bottom' })).toBeInTheDocument();
    expect(log).toHaveAttribute('data-stuck', 'false');
    expect(onStickChange).toHaveBeenCalledWith(false);
  });

  it('scrolls back down when the button is clicked', async () => {
    render(
      <Conversation>
        <Conversation.Content>Hello</Conversation.Content>
        <Conversation.ScrollButton label="Jump to latest" />
      </Conversation>,
    );
    const log = screen.getByRole('log');
    defineScroll(log, 100);
    act(() => {
      fireEvent.scroll(log);
    });
    await userEvent.click(screen.getByRole('button', { name: 'Jump to latest' }));
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 1000 }));
    expect(log).toHaveAttribute('data-stuck', 'true');
  });

  it('sticks again once the user returns to the bottom', () => {
    render(
      <Conversation>
        <Conversation.Content>Hello</Conversation.Content>
        <Conversation.ScrollButton />
      </Conversation>,
    );
    const log = screen.getByRole('log');
    defineScroll(log, 100);
    act(() => {
      fireEvent.scroll(log);
    });
    expect(screen.getByRole('button', { name: 'Scroll to bottom' })).toBeInTheDocument();
    defineScroll(log, 700);
    act(() => {
      fireEvent.scroll(log);
    });
    expect(log).toHaveAttribute('data-stuck', 'true');
  });
});
