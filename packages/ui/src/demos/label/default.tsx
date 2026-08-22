import { Input } from '../../components/input';
import { Label } from '../../components/label';

export function Default() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="workspace-name">Workspace name</Label>
      <Input id="workspace-name" defaultValue="Northwind Labs" />
    </div>
  );
}
