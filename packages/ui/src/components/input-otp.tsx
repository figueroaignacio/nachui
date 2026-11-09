'use client';

import * as React from 'react';
import { cn } from '../lib/cn';
import { resolveDirection } from '../lib/direction';
import { useFormReset } from '../lib/form-control';
import { assignRef } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

type InputOTPPattern = 'digits' | 'alphanumeric' | RegExp;

const PATTERNS: Record<'digits' | 'alphanumeric', RegExp> = {
  digits: /^[0-9]$/,
  alphanumeric: /^[a-zA-Z0-9]$/,
};

function allows(pattern: InputOTPPattern, char: string) {
  const regex = typeof pattern === 'string' ? PATTERNS[pattern] : pattern;
  regex.lastIndex = 0;
  return regex.test(char);
}

function sanitize(raw: string, pattern: InputOTPPattern) {
  return Array.from(raw)
    .filter((char) => allows(pattern, char))
    .join('');
}

type Selection = { start: number; end: number };

type InputOTPContextValue = {
  chars: string[];
  selection: Selection | null;
  invalid: boolean;
  disabled: boolean;
};

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null);

const useInputOTPContext = () => {
  const context = React.use(InputOTPContext);
  if (!context) {
    throw new Error('InputOTP parts must be used within InputOTP');
  }
  return context;
};

interface InputOTPProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'children' | 'id' | 'autoFocus'
> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  pattern?: InputOTPPattern;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  autoFocus?: boolean;
  form?: string;
  id?: string;
  inputClassName?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

const InputOTPRoot = ({
  length = 6,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onComplete,
  pattern = 'digits',
  disabled = false,
  name,
  required,
  autoFocus,
  form,
  id,
  dir = 'ltr',
  className,
  inputClassName,
  children,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: InputOTPProps) => {
  const [storedValue, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const value = storedValue.slice(0, length);
  const [selection, setSelection] = React.useState<Selection | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const pendingCaret = React.useRef<number | null>(null);
  const invalid = ariaInvalid === true || ariaInvalid === 'true';

  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  useFormReset(inputRef, () => setValue(defaultValue), form);

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const sync = React.useCallback(() => {
    const input = inputRef.current;
    if (!input || input.ownerDocument.activeElement !== input) {
      setSelection(null);
      return;
    }
    const filled = input.value.length;
    let start = input.selectionStart ?? filled;
    let end = input.selectionEnd ?? start;
    if (start === end) {
      if (start < filled) {
        end = start + 1;
        input.setSelectionRange(start, end);
      } else if (filled >= length && filled > 0) {
        start = filled - 1;
        end = filled;
        input.setSelectionRange(start, end);
      }
    }
    setSelection((previous) =>
      previous && previous.start === start && previous.end === end ? previous : { start, end },
    );
  }, [length]);

  const moveTo = React.useCallback(
    (index: number) => {
      const input = inputRef.current;
      if (!input) return;
      const filled = input.value.length;
      const target = Math.max(0, Math.min(index, filled));
      input.setSelectionRange(target, target);
      sync();
    },
    [sync],
  );

  React.useEffect(() => {
    const doc = inputRef.current?.ownerDocument;
    if (!doc) return;
    doc.addEventListener('selectionchange', sync);
    return () => doc.removeEventListener('selectionchange', sync);
  }, [sync]);

  React.useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input || input.ownerDocument.activeElement !== input) return;
    if (pendingCaret.current !== null) {
      const caret = Math.min(pendingCaret.current, input.value.length);
      pendingCaret.current = null;
      input.setSelectionRange(caret, caret);
    }
    sync();
  }, [value, sync]);

  const commit = (next: string) => {
    if (next === value) {
      pendingCaret.current = null;
      return;
    }
    setValue(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const raw = input.value;
    const clean = sanitize(raw, pattern).slice(0, length);
    const inputType = (event.nativeEvent as InputEvent).inputType;
    if (clean !== raw && (inputType === 'insertText' || inputType === 'insertCompositionText')) {
      input.value = value;
      if (selection) input.setSelectionRange(selection.start, selection.end);
      return;
    }
    commit(clean);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const input = event.currentTarget;
    const pasted = sanitize(event.clipboardData.getData('text/plain'), pattern);
    if (!pasted) return;
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? start;
    const next =
      pasted.length >= length
        ? pasted.slice(0, length)
        : (value.slice(0, start) + pasted + value.slice(end)).slice(0, length);
    pendingCaret.current = pasted.length >= length ? length : start + pasted.length;
    commit(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
    const current = selection?.start ?? value.length;
    const rtl = resolveDirection(rootRef.current) === 'rtl';
    let target: number | null = null;
    if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = value.length;
    else if (event.key === 'ArrowLeft') target = rtl ? current + 1 : current - 1;
    else if (event.key === 'ArrowRight') target = rtl ? current - 1 : current + 1;
    if (target === null) return;
    event.preventDefault();
    moveTo(target);
  };

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const slots = rootRef.current?.querySelectorAll<HTMLElement>('[data-slot="input-otp-slot"]');
    if (!slots || slots.length === 0) return;
    let nearest: { index: number; distance: number } | null = null;
    for (const slot of slots) {
      const rect = slot.getBoundingClientRect();
      if (rect.width === 0) continue;
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(event.clientX - center);
      const index = Number(slot.dataset.index);
      if (!nearest || distance < nearest.distance) nearest = { index, distance };
    }
    if (nearest) moveTo(nearest.index);
  };

  const chars = React.useMemo(
    () => Array.from({ length }, (_, index) => value[index] ?? ''),
    [value, length],
  );

  const context = React.useMemo<InputOTPContextValue>(
    () => ({ chars, selection, invalid, disabled }),
    [chars, selection, invalid, disabled],
  );

  return (
    <InputOTPContext value={context}>
      <div
        ref={rootRef}
        dir={dir}
        data-slot="input-otp"
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-complete={value.length === length ? '' : undefined}
        className={cn(
          'relative flex w-fit items-center gap-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
          className,
        )}
        {...props}
      >
        {children ?? (
          <InputOTPGroup>
            {chars.map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        )}
        <input
          ref={setInputRef}
          id={id}
          type="text"
          name={name}
          form={form}
          value={value}
          required={required}
          disabled={disabled}
          autoComplete="one-time-code"
          autoCorrect="off"
          autoCapitalize="off"
          inputMode={pattern === 'digits' ? 'numeric' : 'text'}
          maxLength={length}
          pattern={required ? `.{${length}}` : undefined}
          spellCheck={false}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          data-slot="input-otp-input"
          onChange={handleChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onFocus={() => moveTo(value.length)}
          onBlur={() => setSelection(null)}
          onSelect={sync}
          className={cn(
            'absolute inset-0 z-10 size-full cursor-text appearance-none border-0 bg-transparent p-0 font-mono text-base tracking-[-0.5em] text-transparent caret-transparent outline-none [-webkit-text-fill-color:transparent] selection:bg-transparent selection:text-transparent disabled:cursor-not-allowed',
            inputClassName,
          )}
        />
      </div>
    </InputOTPContext>
  );
};
InputOTPRoot.displayName = 'InputOTP';

type InputOTPGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

const InputOTPGroup = ({ className, ...props }: InputOTPGroupProps) => (
  <div
    data-slot="input-otp-group"
    className={cn('flex items-center gap-2', className)}
    {...props}
  />
);
InputOTPGroup.displayName = 'InputOTPGroup';

type InputOTPSlotProps = React.HTMLAttributes<HTMLDivElement> & {
  index: number;
  ref?: React.Ref<HTMLDivElement>;
};

const InputOTPSlot = ({ index, className, ...props }: InputOTPSlotProps) => {
  const { chars, selection, invalid, disabled } = useInputOTPContext();
  const char = chars[index] ?? '';
  const collapsed = selection !== null && selection.start === selection.end;
  const active =
    selection !== null &&
    !disabled &&
    (collapsed ? index === selection.start : index >= selection.start && index < selection.end);

  return (
    <div
      aria-hidden="true"
      data-slot="input-otp-slot"
      data-index={index}
      data-active={active ? '' : undefined}
      data-filled={char ? '' : undefined}
      data-state={active ? 'active' : 'inactive'}
      className={cn(
        'border-input bg-card dark:bg-input/30 text-foreground relative flex h-12 w-11 items-center justify-center rounded-md border font-mono text-xl tabular-nums transition-[border-color,box-shadow] duration-150',
        active && 'border-foreground/40 ring-foreground/10 ring-[1px]',
        invalid && 'border-destructive',
        invalid && active && 'ring-destructive/20',
        className,
      )}
      {...props}
    >
      {char}
      {active && collapsed && !char ? (
        <span className="bg-foreground h-6 w-px animate-pulse motion-reduce:animate-none" />
      ) : null}
    </div>
  );
};
InputOTPSlot.displayName = 'InputOTPSlot';

type InputOTPSeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

const InputOTPSeparator = ({ className, ...props }: InputOTPSeparatorProps) => (
  <div
    role="separator"
    data-slot="input-otp-separator"
    className={cn('bg-border-interactive h-px w-3 shrink-0', className)}
    {...props}
  />
);
InputOTPSeparator.displayName = 'InputOTPSeparator';

const InputOTP = Object.assign(InputOTPRoot, {
  Group: InputOTPGroup,
  Slot: InputOTPSlot,
  Separator: InputOTPSeparator,
});

export { InputOTP };
export type {
  InputOTPGroupProps,
  InputOTPPattern,
  InputOTPProps,
  InputOTPSeparatorProps,
  InputOTPSlotProps,
};
