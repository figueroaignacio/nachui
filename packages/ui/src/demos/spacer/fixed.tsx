import { Button } from '../../components/button';
import { Spacer } from '../../layout/spacer';

export function Fixed() {
  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-6">
      <p className="text-base font-semibold">Delete workspace</p>
      <Spacer size="2" />
      <p className="text-muted-foreground text-sm">
        Every project, deploy and member is removed. This cannot be undone.
      </p>
      <Spacer size="6" />
      <div className="flex">
        <Button variant="outline" size="sm">
          Keep it
        </Button>
        <Spacer axis="horizontal" size="3" />
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </div>
    </div>
  );
}
