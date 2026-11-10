'use client';

import * as React from 'react';
import { Button } from '../components/button';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/use-controllable-state';

type ConfirmationState = 'pending' | 'approved' | 'denied';

type ButtonProps = React.ComponentProps<typeof Button>;

interface ConfirmationContextValue {
  state: ConfirmationState;
  busy: 'approve' | 'deny' | null;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
  decide: (next: 'approved' | 'denied', action?: () => void | PromiseLike<unknown>) => void;
}

const ConfirmationContext = React.createContext<ConfirmationContextValue | null>(null);

const useConfirmationContext = (): ConfirmationContextValue => {
  const context = React.use(ConfirmationContext);
  if (!context) {
    throw new Error('Confirmation components must be used within Confirmation');
  }
  return context;
};

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | undefined)?.then === 'function';

interface ConfirmationProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: ConfirmationState;
  defaultState?: ConfirmationState;
  onStateChange?: (state: ConfirmationState) => void;
  approvedLabel?: string;
  deniedLabel?: string;
}

const ConfirmationRoot = ({
  className,
  state: controlledState,
  defaultState = 'pending',
  onStateChange,
  approvedLabel = 'Approved',
  deniedLabel = 'Denied',
  children,
  ref,
  ...props
}: ConfirmationProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [state, setState] = useControllableState({
    value: controlledState,
    defaultValue: defaultState,
    onChange: onStateChange,
  });
  const [busy, setBusy] = React.useState<'approve' | 'deny' | null>(null);
  const [hasDescription, setHasDescription] = React.useState(false);
  const mounted = React.useRef(true);
  const id = React.useId();

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const decide = React.useCallback(
    (next: 'approved' | 'denied', action?: () => void | PromiseLike<unknown>) => {
      if (busy) return;
      const result = action?.();
      if (!isThenable(result)) {
        setState(next);
        return;
      }
      setBusy(next === 'approved' ? 'approve' : 'deny');
      result.then(
        () => {
          if (!mounted.current) return;
          setBusy(null);
          setState(next);
        },
        () => {
          if (mounted.current) setBusy(null);
        },
      );
    },
    [busy, setState],
  );

  const value = React.useMemo<ConfirmationContextValue>(
    () => ({
      state,
      busy,
      titleId: `${id}-title`,
      descriptionId: `${id}-description`,
      hasDescription,
      setHasDescription,
      decide,
    }),
    [state, busy, id, hasDescription, decide],
  );

  return (
    <ConfirmationContext value={value}>
      <div
        ref={ref}
        role="group"
        aria-labelledby={`${id}-title`}
        aria-describedby={hasDescription ? `${id}-description` : undefined}
        aria-busy={busy ? true : undefined}
        data-slot="confirmation"
        data-state={state}
        className={cn(
          'border-border bg-card text-card-foreground data-[state=pending]:border-warning-border flex flex-col gap-3 rounded-lg border p-3',
          className,
        )}
        {...props}
      >
        {children}
        <p role="status" className="text-muted-foreground text-xs empty:hidden">
          {state === 'approved' ? approvedLabel : state === 'denied' ? deniedLabel : null}
        </p>
      </div>
    </ConfirmationContext>
  );
};

ConfirmationRoot.displayName = 'Confirmation';

type ConfirmationTitleProps = React.HTMLAttributes<HTMLParagraphElement>;

const ConfirmationTitle = ({
  className,
  ref,
  ...props
}: ConfirmationTitleProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  const { titleId } = useConfirmationContext();
  return (
    <p
      ref={ref}
      id={titleId}
      data-slot="confirmation-title"
      className={cn('text-foreground text-sm font-medium', className)}
      {...props}
    />
  );
};

ConfirmationTitle.displayName = 'ConfirmationTitle';

type ConfirmationDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const ConfirmationDescription = ({
  className,
  ref,
  ...props
}: ConfirmationDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  const { descriptionId, setHasDescription } = useConfirmationContext();

  React.useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      ref={ref}
      id={descriptionId}
      data-slot="confirmation-description"
      className={cn('text-muted-foreground -mt-2 text-sm', className)}
      {...props}
    />
  );
};

ConfirmationDescription.displayName = 'ConfirmationDescription';

type ConfirmationActionsProps = React.HTMLAttributes<HTMLDivElement>;

const ConfirmationActions = ({
  className,
  ref,
  ...props
}: ConfirmationActionsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { state } = useConfirmationContext();
  if (state !== 'pending') return null;
  return (
    <div
      ref={ref}
      data-slot="confirmation-actions"
      className={cn('flex flex-wrap justify-end gap-2', className)}
      {...props}
    />
  );
};

ConfirmationActions.displayName = 'ConfirmationActions';

type ConfirmationButtonProps = Omit<ButtonProps, 'onClick'> & {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | PromiseLike<unknown>;
};

const ConfirmationApprove = ({
  children = 'Approve',
  onClick,
  variant = 'default',
  size = 'sm',
  ...props
}: ConfirmationButtonProps) => {
  const { busy, decide } = useConfirmationContext();
  return (
    <Button
      variant={variant}
      size={size}
      loading={busy === 'approve'}
      disabled={busy === 'deny'}
      data-slot="confirmation-approve"
      onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
        decide('approved', onClick ? () => onClick(event) : undefined)
      }
      {...props}
    >
      {children}
    </Button>
  );
};

ConfirmationApprove.displayName = 'ConfirmationApprove';

const ConfirmationDeny = ({
  children = 'Deny',
  onClick,
  variant = 'outline',
  size = 'sm',
  ...props
}: ConfirmationButtonProps) => {
  const { busy, decide } = useConfirmationContext();
  return (
    <Button
      variant={variant}
      size={size}
      loading={busy === 'deny'}
      disabled={busy === 'approve'}
      data-slot="confirmation-deny"
      onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
        decide('denied', onClick ? () => onClick(event) : undefined)
      }
      {...props}
    >
      {children}
    </Button>
  );
};

ConfirmationDeny.displayName = 'ConfirmationDeny';

const Confirmation = Object.assign(ConfirmationRoot, {
  Title: ConfirmationTitle,
  Description: ConfirmationDescription,
  Actions: ConfirmationActions,
  Approve: ConfirmationApprove,
  Deny: ConfirmationDeny,
});

export { Confirmation };
export type {
  ConfirmationActionsProps,
  ConfirmationButtonProps,
  ConfirmationDescriptionProps,
  ConfirmationProps,
  ConfirmationState,
  ConfirmationTitleProps,
};
