import { Button } from '../../components/button';
import { Textarea } from '../../components/textarea';

export function WithError() {
  return (
    <div className="border-border bg-card flex w-full max-w-sm flex-col gap-4 rounded-xl border p-5">
      <div>
        <p className="text-sm font-medium">Request access</p>
        <p className="text-muted-foreground text-xs">
          Tell the workspace owner why you need the production database.
        </p>
      </div>
      <Textarea
        label="Reason"
        defaultValue="debugging"
        error="Add at least 20 characters so the owner has context."
        rows={3}
      />
      <Button size="sm" className="self-start">
        Send request
      </Button>
    </div>
  );
}
