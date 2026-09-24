import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Confirm, ConfirmProvider, useConfirm } from './confirm';

vi.mock('motion/react', async () => {
  const strip = (props: Record<string, unknown>) => {
    const {
      style: _style,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      variants: _variants,
      transition: _transition,
      whileTap: _whileTap,
      whileHover: _whileHover,
      layoutId: _layoutId,
      ...rest
    } = props;
    return rest;
  };
  return {
    motion: {
      div: ({ children, ref, ...props }: React.ComponentProps<'div'> & Record<string, unknown>) => (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          {...(strip(props) as React.ComponentProps<'div'>)}
        >
          {children}
        </div>
      ),
      button: ({
        children,
        ref,
        ...props
      }: React.ComponentProps<'button'> & Record<string, unknown>) => (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          {...(strip(props) as React.ComponentProps<'button'>)}
        >
          {children}
        </button>
      ),
      span: ({
        children,
        ref,
        ...props
      }: React.ComponentProps<'span'> & Record<string, unknown>) => (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          {...(strip(props) as React.ComponentProps<'span'>)}
        >
          {children}
        </span>
      ),
    },
    useReducedMotion: () => true,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

function Deferred() {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('Confirm', () => {
  it('opens an alertdialog from its trigger', async () => {
    render(
      <Confirm title="Delete project" description="This cannot be undone.">
        <Confirm.Trigger>Delete</Confirm.Trigger>
      </Confirm>,
    );
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    const dialog = await screen.findByRole('alertdialog');
    expect(dialog).toHaveAccessibleName('Delete project');
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
  });

  it('cancels, closes and calls onCancel', async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(<Confirm title="Sure?" defaultOpen onCancel={onCancel} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('confirms, calls onConfirm and closes', async () => {
    const onConfirm = vi.fn();
    render(<Confirm title="Sure?" defaultOpen onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('disables both buttons while an async onConfirm is pending', async () => {
    const deferred = Deferred();
    render(<Confirm title="Sure?" defaultOpen onConfirm={() => deferred.promise} />);
    const action = screen.getByRole('button', { name: 'Confirm' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(action);
    expect(action).toBeDisabled();
    expect(action).toHaveAttribute('aria-busy', 'true');
    expect(cancel).toBeDisabled();
    await act(async () => {
      deferred.resolve();
      await deferred.promise;
    });
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('stays open and re-enables when onConfirm rejects', async () => {
    const deferred = Deferred();
    render(<Confirm title="Sure?" defaultOpen onConfirm={() => deferred.promise} />);
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await act(async () => {
      deferred.reject(new Error('nope'));
      await deferred.promise.catch(() => undefined);
    });
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });

  it('gates the confirm button behind requireText', async () => {
    const onConfirm = vi.fn();
    render(<Confirm title="Delete acme" defaultOpen requireText="acme" onConfirm={onConfirm} />);
    const action = screen.getByRole('button', { name: 'Confirm' });
    expect(action).toBeDisabled();
    const input = screen.getByLabelText('Type "acme" to confirm');
    await userEvent.type(input, 'acm');
    expect(action).toBeDisabled();
    await userEvent.type(input, 'e');
    expect(action).toBeEnabled();
    await userEvent.click(action);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('uses the destructive variant on the action', () => {
    render(<Confirm title="Sure?" defaultOpen variant="destructive" confirmText="Delete" />);
    expect(screen.getByRole('alertdialog')).toHaveAttribute('data-variant', 'destructive');
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('bg-destructive');
  });
});

function Consumer({ onResult }: { onResult: (value: boolean) => void }) {
  const confirm = useConfirm();
  return (
    <button
      type="button"
      onClick={() => {
        void confirm({ title: 'Archive it?', confirmText: 'Archive' }).then(onResult);
      }}
    >
      Ask
    </button>
  );
}

describe('useConfirm', () => {
  it('resolves true on confirm', async () => {
    const onResult = vi.fn();
    render(
      <ConfirmProvider>
        <Consumer onResult={onResult} />
      </ConfirmProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Ask' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Archive' }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('resolves false on cancel', async () => {
    const onResult = vi.fn();
    render(
      <ConfirmProvider>
        <Consumer onResult={onResult} />
      </ConfirmProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Ask' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
  });
});
