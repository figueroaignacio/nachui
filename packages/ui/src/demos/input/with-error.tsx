import { Button } from '../../components/button';
import { Input } from '../../components/input';

export function WithError() {
  return (
    <div className="border-border bg-card flex w-full max-w-sm flex-col gap-4 rounded-xl border p-5">
      <div>
        <p className="text-sm font-medium">Invite a teammate</p>
        <p className="text-muted-foreground text-xs">
          They get access to the Northwind Labs workspace.
        </p>
      </div>
      <Input
        label="Work email"
        type="email"
        defaultValue="marco@northwind"
        error="Enter a full address, like marco@northwindlabs.com"
      />
      <Button size="sm" className="self-start">
        Send invite
      </Button>
    </div>
  );
}
