import { Search01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Input } from '../../components/input';

export function WithIcon() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input
        aria-label="Search customers"
        placeholder="Search customers and invoices"
        leftIcon={<HugeiconsIcon icon={Search01Icon} size={16} />}
      />
      <Input
        label="Password"
        type="password"
        placeholder="At least 12 characters"
        rightIcon={<HugeiconsIcon icon={ViewIcon} size={16} />}
      />
    </div>
  );
}
