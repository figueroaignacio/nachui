import { Button } from '../../components/button';
import { ArrowUpRightIcon } from '../../icons/arrow-up-right';
import { Stack } from '../../layout/stack';

export function Link() {
  return (
    <Stack gap="2" className="bg-card w-full max-w-sm rounded-lg p-4 shadow-sm">
      <p className="text-sm font-medium">Rate limit reached</p>
      <p className="text-muted-foreground text-xs">
        This workspace made 10,000 API requests in the last hour. Limits reset at 14:00 UTC.
      </p>
      <Button
        variant="link"
        className="self-start text-sm"
        rightIcon={<ArrowUpRightIcon className="size-3.5" size={14} />}
      >
        Read the rate limit docs
      </Button>
    </Stack>
  );
}
