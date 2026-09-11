import { Button } from '../../components/button';
import { Checkbox } from '../../components/checkbox';
import { Input } from '../../components/input';
import { Label } from '../../components/label';

export function SignIn() {
  return (
    <form className="border-border bg-card flex w-full max-w-sm flex-col gap-4 rounded-xl border p-6">
      <div>
        <p className="text-base font-medium">Sign in</p>
        <p className="text-muted-foreground text-sm">Use your work email to continue.</p>
      </div>
      <Input id="sign-in-email" type="email" label="Email" placeholder="you@company.com" />
      <Input id="sign-in-password" type="password" label="Password" placeholder="••••••••" />
      <div className="flex items-center justify-between">
        <Label htmlFor="sign-in-remember" className="flex items-center gap-2 text-sm font-normal">
          <Checkbox id="sign-in-remember" defaultChecked />
          Remember me
        </Label>
        <a
          href="#"
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
        >
          Forgot password?
        </a>
      </div>
      <Button type="button" className="w-full">
        Continue
      </Button>
    </form>
  );
}
