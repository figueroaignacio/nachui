import { Input } from '../../components/input';
import { Label } from '../../components/label';

export function Required() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-name" required>
          Company name
        </Label>
        <Input id="company-name" placeholder="Northwind Labs SL" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="vat-number" optional description="Printed on every invoice we send you.">
          VAT number
        </Label>
        <Input id="vat-number" placeholder="ESB12345678" />
      </div>
    </div>
  );
}
