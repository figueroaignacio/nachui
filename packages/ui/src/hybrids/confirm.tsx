'use client';

import * as React from 'react';
import { Button } from '../components/button';
import { Dialog } from '../components/dialog';
import { Input } from '../components/input';
import { cn } from '../lib/cn';

type ConfirmVariant = 'default' | 'destructive';

interface ConfirmLabels {
  confirm: string;
  cancel: string;
  typeToConfirm: (text: string) => string;
}

const DEFAULT_LABELS: ConfirmLabels = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  typeToConfirm: (text) => `Type "${text}" to confirm`,
};

interface ConfirmContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant: ConfirmVariant;
  labels: ConfirmLabels;
  pending: boolean;
  requireText?: string;
  typed: string;
  setTyped: (value: string) => void;
  canConfirm: boolean;
  confirm: () => void;
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
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [pending, setPending] = React.useState(false);
  const [typed, setTyped] = React.useState('');
  const mounted = React.useRef(true);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
      if (!next) setTyped('');
    },
    [isControlled, onOpenChange],
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

  const canConfirm = !pending && (requireText === undefined || typed === requireText);

  const confirm = React.useCallback(() => {
    if (!canConfirm) return;
    const result = onConfirm?.();
    if (result && typeof (result as Promise<void>).then === 'function') {
      setPending(true);
      (result as Promise<void>).then(
        () => {
          if (!mounted.current) return;
          setPending(false);
          setOpen(false);
        },
        () => {
          if (mounted.current) setPending(false);
        },
      );
      return;
    }
    setOpen(false);
  }, [canConfirm, onConfirm, setOpen]);

  const cancel = React.useCallback(() => {
    if (pending) return;
    onCancel?.();
    setOpen(false);
  }, [pending, onCancel, setOpen]);

  const value = React.useMemo<ConfirmContextValue>(
    () => ({
      open,
      setOpen,
      title,
      description,
      icon,
      variant,
      labels,
      pending,
      requireText,
      typed,
      setTyped,
      canConfirm,
      confirm,
      cancel,
    }),
    [
      open,
      setOpen,
      title,
      description,
      icon,
      variant,
      labels,
      pending,
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
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next && pending) return;
          if (!next) onCancel?.();
          setOpen(next);
        }}
      >
        {children}
        {!hasContent && <ConfirmContent className={className} />}
      </Dialog>
    </ConfirmContext>
  );
};

ConfirmRoot.displayName = 'Confirm';

type ConfirmTriggerProps = React.ComponentProps<typeof Dialog.Trigger>;

const ConfirmTrigger = ({
  ref,
  ...props
}: ConfirmTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  return <Dialog.Trigger ref={ref} {...props} />;
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
  const { open, title, description, icon, variant, labels, requireText, typed, setTyped } =
    useConfirmContext();
  const inputId = React.useId();

  return (
    <Dialog.Content
      ref={ref}
      role="alertdialog"
      data-variant={variant}
      className={cn('max-w-md', className)}
    >
      <Dialog.Header className="text-left">
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
        <Dialog.Title>{title}</Dialog.Title>
        {description ? <Dialog.Description>{description}</Dialog.Description> : null}
      </Dialog.Header>
      {requireText !== undefined ? (
        <Input
          id={inputId}
          label={labels.typeToConfirm(requireText)}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder={requireText}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              const form = event.currentTarget.closest('[role="alertdialog"]');
              form
                ?.querySelector<HTMLButtonElement>('[data-confirm-action]:not(:disabled)')
                ?.click();
            }
          }}
        />
      ) : null}
      {children ?? (
        <Dialog.Footer className="gap-2 sm:space-x-0">
          <ConfirmCancel />
          <ConfirmAction />
        </Dialog.Footer>
      )}
      <ConfirmFocus open={open} variant={variant} />
    </Dialog.Content>
  );
};

ConfirmContent.displayName = 'ConfirmContent';

const ConfirmFocus = ({ open, variant }: { open: boolean; variant: ConfirmVariant }) => {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        const panel = ref.current?.closest<HTMLElement>('[role="alertdialog"]');
        if (!panel) return;
        const selector =
          variant === 'destructive' ? '[data-confirm-cancel]' : '[data-confirm-action]';
        panel.querySelector<HTMLElement>(selector)?.focus();
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open, variant]);

  return <span ref={ref} hidden />;
};

ConfirmFocus.displayName = 'ConfirmFocus';

type ConfirmButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant'>;

const ConfirmCancel = ({
  className,
  children,
  onClick,
  ref,
  ...props
}: ConfirmButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { labels, pending, cancel } = useConfirmContext();

  return (
    <Button
      ref={ref}
      variant="outline"
      data-confirm-cancel=""
      disabled={pending}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) cancel();
      }}
      {...props}
    >
      {children ?? labels.cancel}
    </Button>
  );
};

ConfirmCancel.displayName = 'ConfirmCancel';

const ConfirmAction = ({
  className,
  children,
  onClick,
  ref,
  ...props
}: ConfirmButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { labels, pending, variant, canConfirm, confirm } = useConfirmContext();

  return (
    <Button
      ref={ref}
      variant={variant === 'destructive' ? 'destructive' : 'default'}
      data-confirm-action=""
      loading={pending}
      disabled={!canConfirm}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) confirm();
      }}
      {...props}
    >
      {children ?? labels.confirm}
    </Button>
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
