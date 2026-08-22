import { Kbd, KbdGroup } from '../../components/kbd';
import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

interface Shortcut {
  action: string;
  keys: { key: string; title?: string }[];
}

const shortcuts: Shortcut[] = [
  {
    action: 'Open the command palette',
    keys: [{ key: '⌘', title: 'Command' }, { key: 'K' }],
  },
  {
    action: 'Jump to a file',
    keys: [{ key: '⌘', title: 'Command' }, { key: 'P' }],
  },
  {
    action: 'Comment on the selection',
    keys: [{ key: '⌘', title: 'Command' }, { key: '⇧', title: 'Shift' }, { key: 'M' }],
  },
  {
    action: 'Toggle the terminal',
    keys: [{ key: 'Ctrl', title: 'Control' }, { key: '`' }],
  },
];

export function WithGroup() {
  return (
    <Stack gap="4" className="border-border bg-card w-full max-w-md rounded-xl border p-4">
      <p className="text-sm font-medium">Keyboard shortcuts</p>
      <Stack gap="3">
        {shortcuts.map((shortcut) => (
          <Flex key={shortcut.action} align="center" justify="between" gap="4">
            <span className="text-muted-foreground truncate text-sm">{shortcut.action}</span>
            <KbdGroup>
              {shortcut.keys.map((entry) => (
                <Kbd key={entry.key} abbrTitle={entry.title}>
                  {entry.key}
                </Kbd>
              ))}
            </KbdGroup>
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
}
