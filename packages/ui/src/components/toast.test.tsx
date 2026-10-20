import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Toast, useToast } from './toast';
import type { ToastOptions } from './toast';

function TestComponent({
  variant,
}: {
  variant?: 'default' | 'success' | 'error' | 'info' | 'warning';
}) {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast({
          title: 'Test toast',
          description: 'Test description',
          variant,
        })
      }
    >
      Show Toast
    </button>
  );
}

describe('Toast', () => {
  it('renders provider and shows toast on trigger', async () => {
    render(
      <Toast.Provider>
        <TestComponent />
      </Toast.Provider>,
    );

    await userEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test toast')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders toast with success variant', async () => {
    render(
      <Toast.Provider>
        <TestComponent variant="success" />
      </Toast.Provider>,
    );

    await userEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test toast')).toBeInTheDocument();
  });

  it('throws when useToast is used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a Toast.Provider');
  });

  it('uses the labels passed to the provider and forwards its ref', async () => {
    let region: HTMLDivElement | null = null;
    render(
      <Toast.Provider
        ref={(node) => {
          region = node;
        }}
        labels={{ region: 'Notificaciones', dismiss: 'Descartar' }}
      >
        <TestComponent />
      </Toast.Provider>,
    );

    await userEvent.click(screen.getByText('Show Toast'));

    expect(screen.getByRole('region', { name: 'Notificaciones' })).toBe(region);
    expect(screen.getByRole('button', { name: 'Descartar' })).toBeInTheDocument();
  });
});

function Trigger({ options }: { options: ToastOptions }) {
  const { toast } = useToast();
  return <button onClick={() => toast(options)}>Notify</button>;
}

function liveRegion(politeness: 'polite' | 'assertive') {
  const region = document.querySelector(`[aria-live="${politeness}"]`);
  if (!region) throw new Error(`missing ${politeness} live region`);
  return region;
}

describe('Toast announcements', () => {
  it('keeps live regions mounted and fills them when a toast appears', async () => {
    render(
      <Toast.Provider>
        <TestComponent />
      </Toast.Provider>,
    );
    const polite = liveRegion('polite');
    expect(polite).toBeEmptyDOMElement();

    await userEvent.click(screen.getByText('Show Toast'));
    expect(liveRegion('polite')).toBe(polite);
    expect(polite).toHaveTextContent('Test toast Test description');
    expect(liveRegion('assertive')).toBeEmptyDOMElement();
  });

  it('announces errors and warnings assertively', async () => {
    render(
      <Toast.Provider>
        <TestComponent variant="error" />
      </Toast.Provider>,
    );
    await userEvent.click(screen.getByText('Show Toast'));
    expect(liveRegion('assertive')).toHaveTextContent('Test toast');
    expect(liveRegion('polite')).toBeEmptyDOMElement();
  });
});

describe('Toast timing', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function show(options: ToastOptions) {
    vi.useFakeTimers();
    render(
      <Toast.Provider>
        <Trigger options={options} />
      </Toast.Provider>,
    );
    fireEvent.click(screen.getByText('Notify'));
  }

  function advance(ms: number) {
    act(() => {
      vi.advanceTimersByTime(ms);
    });
  }

  it('dismisses after the default duration', () => {
    show({ title: 'Saved' });
    advance(4900);
    expect(liveRegion('polite')).toHaveTextContent('Saved');
    advance(200);
    expect(liveRegion('polite')).toBeEmptyDOMElement();
  });

  it('treats an infinite duration as persistent', () => {
    show({ title: 'Sticky', duration: Infinity });
    advance(60000);
    expect(liveRegion('polite')).toHaveTextContent('Sticky');
  });

  it('gives toasts with an action more time', () => {
    show({ title: 'Archived', action: { label: 'Undo', onClick: () => {} } });
    advance(9000);
    expect(liveRegion('polite')).toHaveTextContent('Archived');
    advance(1100);
    expect(liveRegion('polite')).toBeEmptyDOMElement();
  });

  it('pauses while a touch is held on the toast', () => {
    show({ title: 'Held' });
    const toast = screen.getByRole('group', { name: 'Held' });
    fireEvent.pointerDown(toast, { pointerType: 'touch' });
    advance(8000);
    expect(liveRegion('polite')).toHaveTextContent('Held');
    fireEvent.pointerUp(toast, { pointerType: 'touch' });
    advance(5100);
    expect(liveRegion('polite')).toBeEmptyDOMElement();
  });
});

describe('Toast focus and dismissal', () => {
  it('gives the dismiss button a comfortable, readable target', async () => {
    render(
      <Toast.Provider>
        <TestComponent />
      </Toast.Provider>,
    );
    await userEvent.click(screen.getByText('Show Toast'));
    const dismiss = screen.getByRole('button', { name: 'Dismiss notification' });
    expect(dismiss).toHaveClass('size-7', 'pointer-coarse:size-10', 'text-muted-foreground');
    expect(dismiss).not.toHaveClass('opacity-50');
  });

  it('moves focus to the next toast, then back where it came from', async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider>
        <Trigger options={{ title: 'First', duration: 0 }} />
      </Toast.Provider>,
    );
    const trigger = screen.getByText('Notify');
    await user.click(trigger);
    await user.click(trigger);

    await user.keyboard('{F8}');
    const toasts = screen.getAllByRole('group', { name: 'First' });
    expect(toasts[1]).toHaveFocus();

    await user.tab();
    const secondDismiss = within(toasts[1]!).getByRole('button', { name: 'Dismiss notification' });
    expect(secondDismiss).toHaveFocus();
    await user.click(secondDismiss);
    expect(toasts[0]).toHaveFocus();

    await user.tab();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveFocus();
  });

  it('focuses the newest toast with a custom hotkey', async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider hotkey={['altKey', 'KeyT']}>
        <Trigger options={{ title: 'Hello', duration: 0 }} />
      </Toast.Provider>,
    );
    await user.click(screen.getByText('Notify'));
    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveAttribute(
      'aria-keyshortcuts',
      'Alt+T',
    );

    await user.keyboard('{F8}');
    expect(screen.getByRole('group', { name: 'Hello' })).not.toHaveFocus();
    await user.keyboard('{Alt>}t{/Alt}');
    expect(screen.getByRole('group', { name: 'Hello' })).toHaveFocus();
  });

  async function swipe(distance: number) {
    const toast = screen.getByRole('group', { name: 'Swipe me' });
    const nextFrame = () => act(() => new Promise((resolve) => setTimeout(resolve, 120)));
    const at = (x: number) => ({
      pointerId: 1,
      isPrimary: true,
      button: 0,
      pointerType: 'touch',
      clientX: x,
      clientY: 0,
      pageX: x,
      pageY: 0,
    });
    fireEvent.pointerDown(toast, at(0));
    await nextFrame();
    fireEvent.pointerMove(window, at(distance / 2));
    await nextFrame();
    fireEvent.pointerMove(window, at(distance));
    await nextFrame();
    fireEvent.pointerUp(window, at(distance));
  }

  function renderSwipeable() {
    render(
      <Toast.Provider>
        <Trigger options={{ title: 'Swipe me', duration: 0 }} />
      </Toast.Provider>,
    );
    fireEvent.click(screen.getByText('Notify'));
  }

  it('dismisses a toast swiped past the threshold', async () => {
    renderSwipeable();
    await swipe(160);
    await waitFor(() => {
      expect(liveRegion('polite')).toBeEmptyDOMElement();
    });
  });

  it('keeps a toast that was only nudged', async () => {
    renderSwipeable();
    await swipe(30);
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
    expect(liveRegion('polite')).toHaveTextContent('Swipe me');
  });

  it('has no axe violations with a toast open', async () => {
    const { baseElement } = render(
      <Toast.Provider>
        <TestComponent />
      </Toast.Provider>,
    );
    await userEvent.click(screen.getByText('Show Toast'));
    await expectNoAxeViolations(baseElement);
  });
});
