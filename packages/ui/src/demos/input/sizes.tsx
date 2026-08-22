import { Input } from '../../components/input';

const fields = [
  { size: 'sm' as const, label: 'Coupon code', placeholder: 'SPRING25' },
  { size: 'default' as const, label: 'Project name', placeholder: 'Checkout redesign' },
  { size: 'lg' as const, label: 'Search', placeholder: 'Search orders, customers, invoices' },
];

export function Sizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {fields.map((field) => (
        <Input
          key={field.size}
          size={field.size}
          label={field.label}
          placeholder={field.placeholder}
        />
      ))}
    </div>
  );
}
