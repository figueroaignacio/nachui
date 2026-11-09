'use client';

import * as React from 'react';
import { AlertDialog } from '../components/alert-dialog';
import { Button } from '../components/button';
import { Input } from '../components/input';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/use-controllable-state';

type ConfirmVariant = 'default' | 'destructive';

interface ConfirmLabels {
  confirm: string;
  cancel: string;
  typeToConfirm: (text: string) => string;
  error: string;
}

const DEFAULT_LABELS: ConfirmLabels = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  typeToConfirm: (text) => `Type "${text}" to confirm`,
  error: 'Something went wrong. Try again.',
};

interface ConfirmContextValue {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant: ConfirmVariant;
  labels: ConfirmLabels;
  failed: boolean;
  requireText?: string;
  typed: string;
  setTyped: (value: string) => void;
  canConfirm: boolean;
  confirm: () => void | PromiseLike<unknown>;
  cancel: () => void;
}

const ConfirmContext = React.createContext<ConfirmContextValue | null>(null);

const useConfirmContext = (): ConfirmContextValue => {
  const context = React.use(ConfirmContext);
  if (!context) {
    throw new Error('Confirm components must be used within Confirm');
  }
  return context;
};

interface ConfirmProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ConfirmVariant;
  confirmText?: string;
  cancelText?: string;
  labels?: Partial<ConfirmLabels>;
  requireText?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | undefined)?.then === 'function';

const ConfirmRoot = ({
  title,
  description,
  icon,
  variant = 'default',
  confirmText,
  cancelText,
  labels: customLabels,
  requireText,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onConfirm,
  onCancel,
  className,
  children,
}: ConfirmProps) => {
  const [open, setStoredOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [failed, setFailed] = React.useState(false);
  const [typed, setTyped] = React.useState('');

  const setOpen = React.useCallback(
    (next: boolean) => {
      setStoredOpen(next);
      if (!next) {
        setTyped('');
        setFailed(false);
      }
    },
    [setStoredOpen],
  );

  const labels = React.useMemo<ConfirmLabels>(
    () => ({
      ...DEFAULT_LABELS,
      ...customLabels,
      confirm: confirmText ?? customLabels?.confirm ?? DEFAULT_LABELS.confirm,
      cancel: cancelText ?? customLabels?.cancel ?? DEFAULT_LABELS.cancel,
    }),
    [customLabels, confirmText, cancelText],
  );

  const canConfirm = requireText === undefined || typed === requireText;

  const confirm = React.useCallback((): void | PromiseLike<unknown> => {
    setFailed(false);
    const result = onConfirm?.();
    if (!isThenable(result)) return;
    return result.then(undefined, (error: unknown) => {
      setFailed(true);
      throw error;
    });
  }, [onConfirm]);

  const cancel = React.useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const value = React.useMemo<ConfirmContextValue>(
    () => ({
      title,
      description,
      icon,
      variant,
      labels,
      failed,
      requireText,
      typed,
      setTyped,
      canConfirm,
      confirm,
      cancel,
    }),
    [
      title,
      description,
      icon,
      variant,
      labels,
      failed,
      requireText,
      typed,
      canConfirm,
      confirm,
      cancel,
    ],
  );

  const hasContent = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === ConfirmContent,
  );

  return (
    <ConfirmContext value={value}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {children}
        {!hasContent && <ConfirmContent className={className} />}
      </AlertDialog>
    </ConfirmContext>
  );
};

ConfirmRoot.displayName = 'Confirm';

type ConfirmTriggerProps = React.ComponentProps<typeof AlertDialog.Trigger>;

const ConfirmTrigger = ({
  ref,
  ...props
}: ConfirmTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  return <AlertDialog.Trigger ref={ref} {...props} />;
};

ConfirmTrigger.displayName = 'ConfirmTrigger';

interface ConfirmContentProps {
  className?: string;
  children?: React.ReactNode;
}

const ConfirmContent = ({
  className,
  children,
  ref,
}: ConfirmContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { title, description, icon, variant, labels, failed, requireText, typed, setTyped } =
    useConfirmContext();
  const inputId = React.useId();

  return (
    <AlertDialog.Content ref={ref} data-variant={variant} className={className}>
      <AlertDialog.Header>
        {icon ? (
          <span
            aria-hidden="true"
            className={cn(
              'mb-2 flex size-9 items-center justify-center rounded-full border [&>svg]:size-4',
              variant === 'destructive'
                ? 'border-destructive-border bg-destructive-surface text-destructive-text'
                : 'border-border bg-secondary text-foreground',
            )}
          >
            {icon}
          </span>
        ) : null}
        <AlertDialog.Title>{title}</AlertDialog.Title>
        {description ? <AlertDialog.Description>{description}</AlertDialog.Description> : null}
      </AlertDialog.Header>
      {requireText !== undefined ? (
        <Input
          id={inputId}
          data-confirm-input=""
          data-autofocus=""
          label={labels.typeToConfirm(requireText)}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder={requireText}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              const panel = event.currentTarget.closest('[role="alertdialog"]');
              panel
                ?.querySelector<HTMLButtonElement>('[data-confirm-action]:not(:disabled)')
                ?.click();
            }
          }}
        />
      ) : null}
      <p role="alert" className="text-destructive-text text-sm empty:hidden">
        {failed ? labels.error : null}
      </p>
      {children ?? (
        <AlertDialog.Footer>
          <ConfirmCancel />
          <ConfirmAction />
        </AlertDialog.Footer>
      )}
    </AlertDialog.Content>
  );
};

ConfirmContent.displayName = 'ConfirmContent';

type ConfirmButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant'>;

const ConfirmCancel = ({
  className,
  children,
  onClick,
  ref,
  ...props
}: ConfirmButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { labels, cancel } = useConfirmContext();

  return (
    <AlertDialog.Cancel
      ref={ref}
      data-confirm-cancel=""
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) cancel();
      }}
      {...props}
    >
      {children ?? labels.cancel}
    </AlertDialog.Cancel>
  );
};

ConfirmCancel.displayName = 'ConfirmCancel';

const ConfirmAction = ({
  className,
  children,
  onClick,
  disabled,
  ref,
  ...props
}: ConfirmButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { labels, variant, canConfirm, confirm, requireText } = useConfirmContext();

  return (
    <AlertDialog.Action
      ref={ref}
      variant={variant === 'destructive' ? 'destructive' : 'default'}
      data-confirm-action=""
      data-autofocus={variant === 'default' && requireText === undefined ? '' : undefined}
      disabled={disabled || !canConfirm}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        return confirm();
      }}
      {...props}
    >
      {children ?? labels.confirm}
    </AlertDialog.Action>
  );
};

ConfirmAction.displayName = 'ConfirmAction';

const Confirm = Object.assign(ConfirmRoot, {
  Trigger: ConfirmTrigger,
  Content: ConfirmContent,
  Cancel: ConfirmCancel,
  Action: ConfirmAction,
});

interface ConfirmOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ConfirmVariant;
  confirmText?: string;
  cancelText?: string;
  requireText?: string;
  labels?: Partial<ConfirmLabels>;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmFnContext = React.createContext<ConfirmFn | null>(null);

interface PendingConfirm {
  id: number;
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = React.useState<PendingConfirm[]>([]);
  const counter = React.useRef(0);

  const confirm = React.useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      counter.current += 1;
      setQueue((previous) => [...previous, { id: counter.current, options, resolve }]);
    });
  }, []);

  const current = queue[0];

  const settle = (value: boolean) => {
    if (!current) return;
    current.resolve(value);
    setQueue((previous) => previous.filter((item) => item.id !== current.id));
  };

  return (
    <ConfirmFnContext value={confirm}>
      {children}
      {current ? (
        <Confirm
          key={current.id}
          open
          onOpenChange={(open) => {
            if (!open) settle(false);
          }}
          onConfirm={() => settle(true)}
          {...current.options}
        />
      ) : null}
    </ConfirmFnContext>
  );
};

ConfirmProvider.displayName = 'ConfirmProvider';

const useConfirm = (): ConfirmFn => {
  const confirm = React.use(ConfirmFnContext);
  if (!confirm) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return confirm;
};

export { Confirm, ConfirmProvider, useConfirm };
export type {
  ConfirmButtonProps,
  ConfirmContentProps,
  ConfirmFn,
  ConfirmLabels,
  ConfirmOptions,
  ConfirmProps,
  ConfirmTriggerProps,
  ConfirmVariant,
};
