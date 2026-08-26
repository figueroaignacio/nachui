'use client';

import {
  Alert02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';

// --- Position ---

type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-left': 'top-0 left-0 flex-col',
  'top-right': 'top-0 right-0 flex-col items-end',
  'bottom-left': 'bottom-0 left-0 flex-col',
  'bottom-right': 'bottom-0 right-0 flex-col items-end',
} as const;

// --- Animation constants ---

const TOAST_ENTER = {
  initial: { opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
} as const;

const TOAST_EXIT_BY_POSITION: Record<ToastPosition, Record<string, number | string>> = {
  'top-left': { opacity: 0, x: -100, scale: 0.95, filter: 'blur(4px)' },
  'top-right': { opacity: 0, x: 100, scale: 0.95, filter: 'blur(4px)' },
  'bottom-left': { opacity: 0, x: -100, scale: 0.95, filter: 'blur(4px)' },
  'bottom-right': { opacity: 0, x: 100, scale: 0.95, filter: 'blur(4px)' },
} as const;

const TOAST_TRANSITION = {
  type: 'spring',
  damping: 30,
  stiffness: 400,
  mass: 0.4,
} as const;

const TOAST_EXIT_TRANSITION = { duration: 0.2, ease: 'easeIn' } as const;
const REDUCED_MOTION_PROPS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.12 },
} as const;

// --- CVA variants ---

const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-md border p-3.5 bg-background',
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

// --- Variant icons ---

const VARIANT_ICONS: Record<string, typeof CheckmarkCircle01Icon | undefined> = {
  default: undefined,
  success: CheckmarkCircle01Icon,
  error: AlertCircleIcon,
  info: InformationCircleIcon,
  warning: Alert02Icon,
};

// --- Types ---

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

// --- Context ---

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

const useToast = () => {
  const context = React.use(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a Toast.Provider');
  }
  return context;
};

// --- Toast Item ---

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
  position: ToastPosition;
}

function ToastItem({ toast: t, onDismiss, position }: ToastItemProps) {
  const [paused, setPaused] = React.useState(false);
  const isUrgent = t.variant === 'error' || t.variant === 'warning';
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    const duration = t.duration ?? 5000;
    if (duration <= 0 || paused) return;

    const timer = setTimeout(() => {
      onDismiss(t.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [t.id, t.duration, onDismiss, paused]);

  const variantIcon = VARIANT_ICONS[t.variant ?? 'default'];

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
      role={isUrgent ? 'alert' : 'status'}
      aria-live={isUrgent ? 'assertive' : 'polite'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(toastVariants({ variant: t.variant }), 'flex-col')}
    >
      <div className="flex w-full items-center gap-2">
        {variantIcon && <HugeiconsIcon icon={variantIcon} className="shrink-0" size={18} />}
        <p className="flex-1 text-sm font-semibold">{t.title}</p>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => onDismiss(t.id)}
          className="focus-visible:ring-ring shrink-0 rounded-sm opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} aria-hidden="true" />
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

// --- Provider ---

const DEFAULT_MAX_TOASTS = 5;

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  position?: ToastPosition;
}

function ToastProvider({
  children,
  maxToasts = DEFAULT_MAX_TOASTS,
  position = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

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

  const contextValue = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext value={contextValue}>
      {children}
      {mounted &&
        createPortal(
          <div
            role="region"
            aria-label="Notifications"
            className={cn(
              'pointer-events-none fixed z-9999 flex max-h-screen gap-2 p-4',
              POSITION_CLASSES[position],
            )}
          >
            <AnimatePresence mode="popLayout">
              {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={dismiss} position={position} />
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext>
  );
}

ToastProvider.displayName = 'ToastProvider';

// --- Exports ---

const Toast = {
  Provider: ToastProvider,
};

export { Toast, toastVariants, useToast };
export type { ToastData, ToastOptions, ToastPosition, ToastVariant };
