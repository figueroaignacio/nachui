'use client';

import * as React from 'react';
import { Badge } from '../components/badge';
import { Button, type ButtonProps } from '../components/button';
import { Input, type InputProps } from '../components/input';
import { Label } from '../components/label';
import { Select } from '../components/select';
import { Separator } from '../components/separator';
import { Switch, type SwitchProps } from '../components/switch';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function Icon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
    />
  );
}

function CopyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </Icon>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  );
}

const COPIED_TIMEOUT = 1500;

interface SettingsRowContextValue {
  controlId: string;
  labelId: string;
  descriptionId?: string;
  disabled: boolean;
}

const SettingsRowContext = React.createContext<SettingsRowContextValue | null>(null);

const useSettingsRow = (): SettingsRowContextValue => {
  const context = React.use(SettingsRowContext);
  if (!context) {
    throw new Error('SettingsRow components must be used within SettingsRow');
  }
  return context;
};

interface SettingsRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  htmlFor?: string;
  badge?: React.ReactNode;
  disabled?: boolean;
}

interface SettingsRowSwitchProps extends Omit<SwitchProps, 'id'> {
  ref?: React.Ref<HTMLInputElement>;
}

interface SettingsRowSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SettingsRowSelectProps {
  options: SettingsRowSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
}

type SettingsRowInputProps = Omit<InputProps, 'id' | 'label' | 'description'>;

type SettingsRowActionProps = ButtonProps;

interface SettingsRowValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  copy?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  onCopied?: (value: string) => void;
}

interface SettingsSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
}

const SettingsRowRoot = ({
  className,
  label,
  description,
  htmlFor,
  badge,
  disabled = false,
  children,
  ref,
  ...props
}: SettingsRowProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const generatedId = React.useId();
  const controlId = htmlFor ?? `settings-row-${generatedId}`;
  const labelId = `${controlId}-label`;
  const descriptionId = description ? `${controlId}-description` : undefined;

  const value = React.useMemo<SettingsRowContextValue>(
    () => ({ controlId, labelId, descriptionId, disabled }),
    [controlId, labelId, descriptionId, disabled],
  );

  return (
    <SettingsRowContext value={value}>
      <div
        ref={ref}
        data-slot="settings-row"
        data-disabled={disabled ? 'true' : undefined}
        className={cn(
          'group flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6',
          disabled && 'opacity-60',
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Label id={labelId} htmlFor={controlId}>
              {label}
            </Label>
            {badge}
          </div>
          {description ? (
            <p id={descriptionId} className="text-muted-foreground text-xs leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:justify-end">{children}</div>
      </div>
    </SettingsRowContext>
  );
};

SettingsRowRoot.displayName = 'SettingsRow';

const SettingsRowSwitch = ({ disabled, ref, ...props }: SettingsRowSwitchProps) => {
  const row = useSettingsRow();

  return (
    <Switch
      ref={ref}
      id={row.controlId}
      aria-describedby={row.descriptionId}
      disabled={disabled ?? row.disabled}
      {...props}
    />
  );
};

SettingsRowSwitch.displayName = 'SettingsRowSwitch';

const SettingsRowSelect = ({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  name,
  disabled,
  className,
}: SettingsRowSelectProps) => {
  const row = useSettingsRow();

  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled ?? row.disabled}
      className={cn('w-full sm:w-48', className)}
    >
      <Select.Trigger
        id={row.controlId}
        size="sm"
        placeholder={placeholder}
        aria-labelledby={row.labelId}
        aria-describedby={row.descriptionId}
      />
      <Select.Content>
        {options.map((option) => (
          <Select.Item key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};

SettingsRowSelect.displayName = 'SettingsRowSelect';

const SettingsRowInput = ({
  className,
  disabled,
  size = 'sm',
  ref,
  ...props
}: SettingsRowInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const row = useSettingsRow();

  return (
    <div className="w-full sm:w-56">
      <Input
        ref={ref}
        id={row.controlId}
        size={size}
        aria-describedby={row.descriptionId}
        disabled={disabled ?? row.disabled}
        className={className}
        {...props}
      />
    </div>
  );
};

SettingsRowInput.displayName = 'SettingsRowInput';

const SettingsRowAction = ({
  variant = 'outline',
  size = 'sm',
  disabled,
  ref,
  ...props
}: SettingsRowActionProps) => {
  const row = useSettingsRow();

  return (
    <Button
      ref={ref}
      id={row.controlId}
      variant={variant}
      size={size}
      aria-describedby={row.descriptionId}
      disabled={disabled ?? row.disabled}
      {...props}
    />
  );
};

SettingsRowAction.displayName = 'SettingsRowAction';

const SettingsRowValue = ({
  className,
  value,
  copy = false,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  onCopied,
  ref,
  ...props
}: SettingsRowValueProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const row = useSettingsRow();
  const [copied, setCopied] = React.useState(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const label = copied ? copiedLabel : copyLabel;

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-1.5', className)}
      aria-labelledby={row.labelId}
      {...props}
    >
      <code
        id={row.controlId}
        className="bg-secondary text-foreground rounded-md px-2 py-1 font-mono text-xs"
      >
        {value}
      </code>
      {copy ? (
        <button
          type="button"
          aria-label={label}
          title={label}
          data-copied={copied ? '' : undefined}
          disabled={row.disabled}
          onClick={() => {
            const write = navigator.clipboard?.writeText(value);
            void Promise.resolve(write).then(() => {
              onCopied?.(value);
              setCopied(true);
              if (timeout.current) clearTimeout(timeout.current);
              timeout.current = setTimeout(() => setCopied(false), COPIED_TIMEOUT);
            });
          }}
          className="text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring data-[copied]:text-success-text inline-flex size-7 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none"
        >
          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
        </button>
      ) : null}
    </div>
  );
};

SettingsRowValue.displayName = 'SettingsRowValue';

const SettingsSection = ({
  className,
  title,
  description,
  footer,
  children,
  ref,
  ...props
}: SettingsSectionProps & { ref?: React.Ref<HTMLElement> }) => {
  const rows = React.Children.toArray(children).filter(Boolean);

  return (
    <section
      ref={ref}
      data-slot="settings-section"
      className={cn('border-border bg-card w-full overflow-hidden rounded-lg border', className)}
      {...props}
    >
      <header className="border-rule flex flex-col gap-1 border-b px-5 py-4">
        <h3 className="text-foreground text-sm font-medium">{title}</h3>
        {description ? (
          <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
        ) : null}
      </header>
      <div className="px-5">
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            {index > 0 ? <Separator /> : null}
            {row}
          </React.Fragment>
        ))}
      </div>
      {footer ? (
        <footer className="border-rule bg-surface-muted flex items-center justify-end gap-2 border-t px-5 py-3">
          {footer}
        </footer>
      ) : null}
    </section>
  );
};

SettingsSection.displayName = 'SettingsSection';

const SettingsRow = Object.assign(SettingsRowRoot, {
  Switch: SettingsRowSwitch,
  Select: SettingsRowSelect,
  Input: SettingsRowInput,
  Action: SettingsRowAction,
  Value: SettingsRowValue,
  Section: SettingsSection,
});

export { SettingsRow, SettingsSection, useSettingsRow };
export type {
  SettingsRowActionProps,
  SettingsRowInputProps,
  SettingsRowProps,
  SettingsRowSelectOption,
  SettingsRowSelectProps,
  SettingsRowSwitchProps,
  SettingsRowValueProps,
  SettingsSectionProps,
};
