import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';
import { Stack } from '../../layout/stack';

export function Link() {
  return (
    <Stack gap="2" className="border-border bg-card w-full max-w-sm rounded-xl border p-4">
      <p className="text-sm font-medium">Rate limit reached</p>
      <p className="text-muted-foreground text-xs">
        This workspace made 10,000 API requests in the last hour. Limits reset at 14:00 UTC.
      </p>
      <Button
        variant="link"
        className="self-start text-sm"
        rightIcon={<HugeiconsIcon icon={ArrowUpRight01Icon} className="size-3.5" size={14} />}
      >
        Read the rate limit docs
      </Button>
    </Stack>
  );
}
