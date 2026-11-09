import * as React from 'react';

interface FormValueProps {
  name?: string;
  value: string | readonly string[];
  required?: boolean;
  disabled?: boolean;
  form?: string;
  onFocus?: () => void;
}

const noop = () => undefined;

const HIDDEN_CLASS = 'pointer-events-none absolute bottom-0 start-0 h-px w-full opacity-0';

export function FormValue({ name, value, required, disabled, form, onFocus }: FormValueProps) {
  if (!name && !required) return null;

  const values = typeof value === 'string' ? [value] : value;

  if (values.length === 0) {
    return React.createElement('input', {
      'aria-hidden': true,
      tabIndex: -1,
      name,
      value: '',
      required,
      disabled,
      form,
      onChange: noop,
      onFocus,
      className: HIDDEN_CLASS,
    });
  }

  return React.createElement(
    React.Fragment,
    null,
    values.map((item, index) =>
      React.createElement('input', {
        key: `${index}-${item}`,
        'aria-hidden': true,
        tabIndex: -1,
        name,
        value: item,
        required: index === 0 ? required : undefined,
        disabled,
        form,
        onChange: noop,
        onFocus,
        className: HIDDEN_CLASS,
      }),
    ),
  );
}

export function useFormReset(
  ref: React.RefObject<HTMLElement | null>,
  onReset: () => void,
  formId?: string,
) {
  const onResetRef = React.useRef(onReset);

  React.useLayoutEffect(() => {
    onResetRef.current = onReset;
  });

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const form = formId
      ? (element.ownerDocument.getElementById(formId) as HTMLFormElement | null)
      : element.closest('form');
    if (!form) return;
    const handleReset = () => onResetRef.current();
    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [ref, formId]);
}
