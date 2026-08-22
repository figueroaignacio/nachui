import { Add01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';
import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

const rows = [
  {
    size: 'sm' as const,
    place: 'Table row',
    title: 'Invoice #2041',
    detail: 'Northwind Labs, $1,280',
    action: 'Mark as paid',
  },
  {
    size: 'default' as const,
    place: 'Form footer',
    title: 'Billing address',
    detail: 'Updated 3 days ago',
    action: 'Save changes',
  },
  {
    size: 'lg' as const,
    place: 'Pricing page',
    title: 'Team plan',
    detail: '$24 per seat, billed monthly',
    action: 'Start free trial',
  },
];

export function Sizes() {
  return (
    <Stack gap="3" className="w-full max-w-md">
      {rows.map((row) => (
        <Flex
          key={row.size}
          align="center"
          justify="between"
          gap="4"
          className="border-border bg-card rounded-xl border p-4"
        >
          <div className="min-w-0">
            <p className="text-muted-foreground text-[11px] tracking-wide uppercase">{row.place}</p>
            <p className="mt-1 truncate text-sm font-medium">{row.title}</p>
            <p className="text-muted-foreground truncate text-xs">{row.detail}</p>
          </div>
          <Button
            size={row.size}
            leftIcon={
              <HugeiconsIcon
                icon={Add01Icon}
                className={row.size === 'lg' ? 'size-5' : 'size-4'}
                size={row.size === 'lg' ? 20 : 16}
              />
            }
          >
            {row.action}
          </Button>
        </Flex>
      ))}
      <Flex
        align="center"
        justify="between"
        gap="4"
        className="border-border bg-card rounded-xl border p-4"
      >
        <div className="min-w-0">
          <p className="text-muted-foreground text-[11px] tracking-wide uppercase">Toolbar</p>
          <p className="mt-1 truncate text-sm font-medium">Search this project</p>
          <p className="text-muted-foreground truncate text-xs">
            Icon size keeps the button square
          </p>
        </div>
        <Button size="icon" aria-label="Search this project">
          <HugeiconsIcon icon={Search01Icon} className="size-4" size={16} />
        </Button>
      </Flex>
    </Stack>
  );
}
