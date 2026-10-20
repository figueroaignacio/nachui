import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
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

  it('renders a focusable, labelled log that does not announce every change', async () => {
    const { container } = render(
      <Conversation>
        <Conversation.Content>Hello</Conversation.Content>
      </Conversation>,
    );
    const log = screen.getByRole('log', { name: 'Conversation' });
    expect(log).toHaveAttribute('aria-live', 'off');
    expect(log).toHaveAttribute('tabindex', '0');
    expect(log).toHaveAttribute('data-stuck', 'true');
    expect(screen.getByText('Hello')).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('announces finished messages through an always mounted status', () => {
    const { rerender } = render(
      <Conversation label="Chat">
        <Conversation.Content>Hello</Conversation.Content>
      </Conversation>,
    );
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    expect(screen.getByRole('log', { name: 'Chat' })).toBeInTheDocument();
    rerender(
      <Conversation label="Chat" announcement="Assistant replied">
        <Conversation.Content>Hello</Conversation.Content>
      </Conversation>,
    );
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Assistant replied');
  });

  it('jumps instantly when the user prefers reduced motion', async () => {
    const matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    });
    vi.stubGlobal('matchMedia', matchMedia);
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
    await userEvent.click(screen.getByRole('button', { name: 'Scroll to bottom' }));
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }));
    vi.unstubAllGlobals();
  });

  it('moves focus to the log before the scroll button goes away', async () => {
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
    const button = screen.getByRole('button', { name: 'Scroll to bottom' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(log).toHaveFocus();
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
