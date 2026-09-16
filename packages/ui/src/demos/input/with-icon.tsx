import { Input } from '../../components/input';
import { EyeIcon } from '../../icons/eye';
import { SearchIcon } from '../../icons/search';

export function WithIcon() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input
        aria-label="Search customers"
        placeholder="Search customers and invoices"
        leftIcon={<SearchIcon size={16} />}
      />
      <Input
        label="Password"
        type="password"
        placeholder="At least 12 characters"
        rightIcon={<EyeIcon size={16} />}
      />
    </div>
  );
}
