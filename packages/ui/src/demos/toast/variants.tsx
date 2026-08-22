'use client';

import { Button } from '../../components/button';
import { Toast, useToast } from '../../components/toast';

const variants = [
  {
    label: 'Default',
    options: {
      title: 'Invitation sent',
      description: 'Lucia Mendez gets access to Acme Studio once she accepts.',
    },
  },
  {
    label: 'Success',
    options: {
      title: 'Deployed to production',
      description: 'checkout-flow built in 42s and is serving traffic.',
      variant: 'success' as const,
    },
  },
  {
    label: 'Error',
    options: {
      title: 'Payment declined',
      description: 'Visa ending 4242 was rejected by the issuing bank.',
      variant: 'error' as const,
    },
  },
  {
    label: 'Info',
    options: {
      title: 'Export is being prepared',
      description: 'We will email a download link to lucia@acmestudio.dev when it is ready.',
      variant: 'info' as const,
    },
  },
  {
    label: 'Warning',
    options: {
      title: 'Approaching the rate limit',
      description: 'You have used 9,400 of 10,000 requests this hour.',
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
