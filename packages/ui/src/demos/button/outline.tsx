import { Button } from '../../components/button';
import { DownloadIcon } from '../../icons/download';
import { Flex } from '../../layout/flex';

export function Outline() {
  return (
    <Flex
      align="center"
      justify="between"
      gap="4"
      className="border-border bg-card w-full max-w-md rounded-xl border p-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">Invoices</p>
        <p className="text-muted-foreground text-xs">142 records, Jan 1 to Mar 31</p>
      </div>
      <Button variant="outline" leftIcon={<DownloadIcon className="size-4" size={16} />}>
        Export CSV
      </Button>
    </Flex>
  );
}
