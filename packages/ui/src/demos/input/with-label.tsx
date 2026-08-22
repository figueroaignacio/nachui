import { Input } from '../../components/input';

export function WithLabel() {
  return (
    <div className="w-full max-w-sm">
      <Input
        label="Work email"
        description="Invoices and deploy alerts are sent here."
        placeholder="you@northwindlabs.com"
        type="email"
      />
    </div>
  );
}
