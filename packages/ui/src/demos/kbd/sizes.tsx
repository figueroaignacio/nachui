import { Kbd, KbdGroup } from '../../components/kbd';
import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

interface Row {
  size: 'sm' | 'default' | 'lg';
  place: string;
  action: string;
  keys: { key: string; title?: string }[];
}

const rows: Row[] = [
  {
    size: 'sm',
    place: 'Menu item',
    action: 'Toggle sidebar',
    keys: [{ key: '⌘', title: 'Command' }, { key: 'B' }],
  },
  {
    size: 'default',
    place: 'Shortcut list',
    action: 'Save draft',
    keys: [{ key: '⌘', title: 'Command' }, { key: 'S' }],
  },
  {
    size: 'lg',
    place: 'Empty state',
    action: 'Open the command palette',
    keys: [{ key: '⌘', title: 'Command' }, { key: 'K' }],
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
            <p className="mt-1 truncate text-sm font-medium">{row.action}</p>
          </div>
          <KbdGroup>
            {row.keys.map((entry) => (
              <Kbd key={entry.key} size={row.size} abbrTitle={entry.title}>
                {entry.key}
              </Kbd>
            ))}
          </KbdGroup>
        </Flex>
      ))}
    </Stack>
  );
}
