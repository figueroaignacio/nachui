'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { springs } from '../lib/motion';
import { useIsClient } from '../lib/overlay';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function AlertCircleIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5V13" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function AlertTriangleIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M10.3 4.2 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4.5" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function CheckCircleIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12 2.7 2.7L16 9.3" />
    </svg>
  );
}

function InfoIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11v5.5" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

function XIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-left':
    'top-0 left-0 flex-col pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))]',
  'top-right':
    'top-0 right-0 flex-col items-end pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))]',
  'bottom-left':
    'bottom-0 left-0 flex-col pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))]',
  'bottom-right':
    'bottom-0 right-0 flex-col items-end pb-[max(1rem,env(safe-area-inset-bottom))] pr-[max(1rem,env(safe-area-inset-right))]',
} as const;

const TOAST_ENTER = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
} as const;

const TOAST_EXIT_BY_POSITION: Record<ToastPosition, Record<string, number | string>> = {
  'top-left': { opacity: 0, x: -100, scale: 0.95 },
  'top-right': { opacity: 0, x: 100, scale: 0.95 },
  'bottom-left': { opacity: 0, x: -100, scale: 0.95 },
  'bottom-right': { opacity: 0, x: 100, scale: 0.95 },
} as const;

const TOAST_TRANSITION = springs.smooth;

const TOAST_EXIT_TRANSITION = { duration: 0.2, ease: 'easeIn' } as const;
const REDUCED_MOTION_PROPS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.12 },
} as const;

const DEFAULT_DURATION = 5000;
const DEFAULT_ACTION_DURATION = 10000;
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 500;

const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-md border p-3.5 bg-popover shadow-md touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'text-foreground border-border',
        success: 'text-success-text border-success-border',
        error: 'text-destructive-text border-destructive-border',
        info: 'text-info-text border-info-border',
        warning: 'text-warning-text border-warning-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type ToastVariant = VariantProps<typeof toastVariants>['variant'];

const VARIANT_ICONS: Record<string, React.ComponentType<IconProps> | undefined> = {
  default: undefined,
  success: CheckCircleIcon,
  error: AlertCircleIcon,
  info: InfoIcon,
  warning: AlertTriangleIcon,
};

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

type ToastOptions = Omit<ToastData, 'id'>;

interface ToastContextType {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

const useToast = () => {
  const context = React.use(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a Toast.Provider');
  }
  return context;
};

function isUrgent(toast: ToastData) {
  return toast.variant === 'error' || toast.variant === 'warning';
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
  position: ToastPosition;
  dismissLabel: string;
  regionPaused: boolean;
}

function ToastItem({ toast: t, onDismiss, position, dismissLabel, regionPaused }: ToastItemProps) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const paused = hovered || pressed || dragging || regionPaused;
  const shouldReduceMotion = useReducedMotion();
  const duration = t.duration ?? (t.action ? DEFAULT_ACTION_DURATION : DEFAULT_DURATION);
  const persistent = !Number.isFinite(duration) || duration <= 0;
  const remainingRef = React.useRef(duration);
  const titleId = React.useId();

  React.useEffect(() => {
    remainingRef.current = duration;
  }, [duration]);

  React.useEffect(() => {
    if (persistent || paused) return;

    const startedAt = Date.now();
    const timer = setTimeout(() => {
      onDismiss(t.id);
    }, remainingRef.current);

    return () => {
      clearTimeout(timer);
      const elapsed = Date.now() - startedAt;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
    };
  }, [t.id, persistent, onDismiss, paused]);

  const VariantIcon = VARIANT_ICONS[t.variant ?? 'default'];

  return (
    <motion.div
      layout
      initial={shouldReduceMotion ? REDUCED_MOTION_PROPS.initial : TOAST_ENTER.initial}
      animate={shouldReduceMotion ? REDUCED_MOTION_PROPS.animate : TOAST_ENTER.animate}
      exit={
        shouldReduceMotion
          ? REDUCED_MOTION_PROPS.exit
          : { ...TOAST_EXIT_BY_POSITION[position], transition: TOAST_EXIT_TRANSITION }
      }
      transition={shouldReduceMotion ? REDUCED_MOTION_PROPS.transition : TOAST_TRANSITION}
      drag="x"
      dragSnapToOrigin
      dragElastic={0.6}
      onDragStart={() => setDragging(true)}
      onDragEnd={(_, info) => {
        setDragging(false);
        if (
          Math.abs(info.offset.x) > SWIPE_DISTANCE ||
          Math.abs(info.velocity.x) > SWIPE_VELOCITY
        ) {
          onDismiss(t.id);
        }
      }}
      role="group"
      aria-labelledby={titleId}
      tabIndex={-1}
      data-toast-id={t.id}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setHovered(false);
        else setPressed(false);
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== 'mouse') setPressed(true);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className={cn(toastVariants({ variant: t.variant }), 'flex-col')}
    >
      <div className="flex w-full items-center gap-2">
        {VariantIcon && <VariantIcon className="shrink-0" size={18} />}
        <p id={titleId} className="flex-1 text-sm font-semibold">
          {t.title}
        </p>
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={() => onDismiss(t.id)}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring -my-1 -me-1.5 inline-flex size-7 shrink-0 items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none pointer-coarse:-my-2.5 pointer-coarse:-me-3 pointer-coarse:size-10"
        >
          <XIcon size={16} aria-hidden="true" />
        </button>
      </div>
      {(t.description || t.action) && (
        <>
          <div className="text-muted-foreground w-full">
            {t.description && <p className="text-sm">{t.description}</p>}
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick();
                  onDismiss(t.id);
                }}
                className="hover:bg-muted focus-visible:ring-ring mt-2 shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {t.action.label}
              </button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

function ToastAnnouncer({ toasts, urgent }: { toasts: ToastData[]; urgent: boolean }) {
  return (
    <div className="sr-only" aria-live={urgent ? 'assertive' : 'polite'} aria-atomic="false">
      {toasts
        .filter((t) => isUrgent(t) === urgent)
        .map((t) => (
          <p key={t.id}>
            {t.title}
            {t.description ? ` ${t.description}` : null}
          </p>
        ))}
    </div>
  );
}

const DEFAULT_MAX_TOASTS = 5;
const DEFAULT_HOTKEY = ['F8'];

const MODIFIER_KEYS = {
  altKey: 'Alt',
  ctrlKey: 'Control',
  metaKey: 'Meta',
  shiftKey: 'Shift',
} as const;

function isModifier(key: string): key is keyof typeof MODIFIER_KEYS {
  return key in MODIFIER_KEYS;
}

function matchesHotkey(event: KeyboardEvent, hotkey: readonly string[]) {
  if (hotkey.length === 0) return false;
  return hotkey.every((key) =>
    isModifier(key) ? event[key] : event.code === key || event.key === key,
  );
}

function describeHotkey(hotkey: readonly string[]) {
  return hotkey
    .map((key) => (isModifier(key) ? MODIFIER_KEYS[key] : key.replace(/^(Key|Digit)/, '')))
    .join('+');
}

interface ToastLabels {
  region: string;
  dismiss: string;
}

const DEFAULT_LABELS: ToastLabels = {
  region: 'Notifications',
  dismiss: 'Dismiss notification',
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  position?: ToastPosition;
  labels?: Partial<ToastLabels>;
  hotkey?: string[];
}

function ToastProvider({
  children,
  maxToasts = DEFAULT_MAX_TOASTS,
  position = 'bottom-right',
  labels: labelOverrides,
  hotkey = DEFAULT_HOTKEY,
  ref,
}: ToastProviderProps & { ref?: React.Ref<HTMLDivElement> }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);
  const [regionFocused, setRegionFocused] = React.useState(false);
  const mounted = useIsClient();
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const regionRef = React.useRef<HTMLDivElement | null>(null);
  const toastsRef = React.useRef<ToastData[]>(toasts);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const hotkeyId = hotkey.join('+');

  const findToastElement = React.useCallback((id: string | undefined) => {
    if (id === undefined) return null;
    const items = regionRef.current?.querySelectorAll<HTMLElement>('[data-toast-id]') ?? [];
    return Array.from(items).find((item) => item.dataset.toastId === id) ?? null;
  }, []);

  React.useLayoutEffect(() => {
    toastsRef.current = toasts;
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    const host = active.closest<HTMLElement>('[data-toast-id]');
    if (!host || !regionRef.current?.contains(host)) return;
    if (toasts.some((t) => t.id === host.dataset.toastId)) return;
    const newest = findToastElement(toasts[toasts.length - 1]?.id);
    const returnTo = returnFocusRef.current;
    if (newest) newest.focus();
    else if (returnTo?.isConnected) returnTo.focus();
    else active.blur();
  }, [toasts, findToastElement]);

  const dismiss = React.useCallback(
    (id: string) => {
      const current = toastsRef.current;
      const index = current.findIndex((t) => t.id === id);
      const element = findToastElement(id);
      const active = document.activeElement;

      if (index !== -1 && element && active && element.contains(active)) {
        const neighbor = findToastElement(current[index + 1]?.id ?? current[index - 1]?.id);
        const returnTo = returnFocusRef.current;
        if (neighbor) neighbor.focus();
        else if (returnTo?.isConnected) returnTo.focus();
        else if (active instanceof HTMLElement) active.blur();
      }

      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    [findToastElement],
  );

  const toast = React.useCallback(
    (options: ToastOptions): string => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newToast: ToastData = { ...options, id };

      setToasts((prev) => {
        const next = [...prev, newToast];
        if (next.length > maxToasts) {
          return next.slice(-maxToasts);
        }
        return next;
      });

      return id;
    },
    [maxToasts],
  );

  React.useEffect(() => {
    const keys = hotkeyId ? hotkeyId.split('+') : [];
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!matchesHotkey(event, keys)) return;
      const newest = findToastElement(toastsRef.current[toastsRef.current.length - 1]?.id);
      if (!newest) return;
      event.preventDefault();
      const active = document.activeElement;
      if (active instanceof HTMLElement && !regionRef.current?.contains(active)) {
        returnFocusRef.current = active;
      }
      newest.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hotkeyId, findToastElement]);

  const setRegionRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      regionRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const contextValue = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext value={contextValue}>
      {children}
      <ToastAnnouncer toasts={toasts} urgent={false} />
      <ToastAnnouncer toasts={toasts} urgent />
      {mounted &&
        createPortal(
          <div
            role="region"
            ref={setRegionRef}
            aria-label={labels.region}
            aria-keyshortcuts={hotkey.length > 0 ? describeHotkey(hotkey) : undefined}
            onFocus={(event) => {
              const from = event.relatedTarget;
              if (from instanceof HTMLElement && !event.currentTarget.contains(from)) {
                returnFocusRef.current = from;
              }
              setRegionFocused(true);
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setRegionFocused(false);
              }
            }}
            className={cn(
              'pointer-events-none fixed z-9999 flex max-h-dvh w-full max-w-sm gap-2 p-4',
              POSITION_CLASSES[position],
            )}
          >
            <AnimatePresence mode="popLayout">
              {toasts.map((t) => (
                <ToastItem
                  key={t.id}
                  toast={t}
                  onDismiss={dismiss}
                  position={position}
                  dismissLabel={labels.dismiss}
                  regionPaused={regionFocused}
                />
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext>
  );
}

ToastProvider.displayName = 'ToastProvider';

const Toast = {
  Provider: ToastProvider,
};

export { Toast, toastVariants, useToast };
export type {
  ToastData,
  ToastLabels,
  ToastOptions,
  ToastPosition,
  ToastProviderProps,
  ToastVariant,
};
