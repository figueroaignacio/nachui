import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';

export function PreviewMilestoneForm() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Set a new milestone</Card.Title>
        <Card.Description className="text-xs">
          Define your financial target and we&apos;ll help you pace your savings.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-3">
        <Input label="Goal Name" placeholder="e.g. New Car, Home Downpayment" size="sm" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Target Amount" placeholder="$15,000" size="sm" />
          <Input label="Target Date" placeholder="Dec 2025" size="sm" />
        </div>
      </Card.Content>
      <Card.Footer compact className="mt-4 flex-col gap-2">
        <Button size="sm" fullWidth>
          Create Goal
        </Button>
        <Button size="sm" variant="ghost" fullWidth>
          Cancel
        </Button>
      </Card.Footer>
    </Card>
  );
}
