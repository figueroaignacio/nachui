import { Kbd, KbdGroup } from '../../components/kbd';
import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

export function Variants() {
  return (
    <Stack gap="3" className="w-full max-w-md">
      <Flex align="center" justify="between" gap="4" className="bg-muted/50 rounded-lg px-3 py-2">
        <span className="truncate text-sm">Open the command palette</span>
        <KbdGroup>
          <Kbd abbrTitle="Command">⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Flex>
      <Flex
        align="center"
        justify="between"
        gap="4"
        className="border-border bg-card rounded-lg border px-3 py-2"
      >
        <span className="text-muted-foreground truncate text-sm">
          Close without saving the draft
        </span>
        <Kbd variant="outline" abbrTitle="Escape">
          Esc
        </Kbd>
      </Flex>
    </Stack>
  );
}
