import { Button } from '../../components/button';
import { Separator } from '../../components/separator';

export function WithLabel() {
  return (
    <div className="border-border bg-card w-full max-w-sm space-y-4 rounded-xl border p-6">
      <div>
        <h4 className="text-sm font-medium">Sign in to Acme Studio</h4>
        <p className="text-muted-foreground text-sm">Use the account your team invited.</p>
      </div>
      <Button className="w-full">Continue with email</Button>
      <Separator label="or continue with" />
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline">GitHub</Button>
        <Button variant="outline">Google</Button>
      </div>
      <Separator />
      <p className="text-muted-foreground text-xs">Single sign on is available on the Team plan.</p>
    </div>
  );
}
