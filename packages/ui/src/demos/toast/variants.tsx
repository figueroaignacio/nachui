'use client';

import { Button } from '../../components/button';
import { Toast, useToast } from '../../components/toast';

const variants = [
  {
    label: 'Default',
    options: { title: 'Default notification', description: 'This is a default toast.' },
  },
  {
    label: 'Success',
    options: {
      title: 'Success!',
      description: 'Your changes have been saved.',
      variant: 'success' as const,
    },
  },
  {
    label: 'Error',
    options: {
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      variant: 'error' as const,
    },
  },
  {
    label: 'Info',
    options: {
      title: 'Info',
      description: 'A new version is available.',
      variant: 'info' as const,
    },
  },
  {
    label: 'Warning',
    options: {
      title: 'Warning',
      description: 'Your session is about to expire.',
      variant: 'warning' as const,
    },
  },
];

function VariantsDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Button key={variant.label} variant="outline" onClick={() => toast(variant.options)}>
          {variant.label}
        </Button>
      ))}
    </div>
  );
}

export function Variants() {
  return (
    <Toast.Provider>
      <VariantsDemo />
    </Toast.Provider>
  );
}
