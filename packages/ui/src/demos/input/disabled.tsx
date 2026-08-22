import { Input } from '../../components/input';

export function Disabled() {
  return (
    <div className="w-full max-w-sm">
      <Input
        label="Billing email"
        description="Only the workspace owner can change this address."
        type="email"
        defaultValue="billing@northwindlabs.com"
        disabled
      />
    </div>
  );
}
