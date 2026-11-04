import { Card } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Kbd } from '@repo/ui/components/kbd';
import { cn } from '@repo/ui/lib/cn';
import { SearchIcon } from '@repo/ui/icons/search';

const items = [
  { label: 'Button', family: 'ui' },
  { label: 'Dialog', family: 'ui' },
  { label: 'Prompt input', family: 'ai' },
  { label: 'Stack', family: 'layout' },
];

export function PreviewCommand() {
  return (
    <Card>
      <Card.Content compact>
        <Input
          size="sm"
          placeholder="Search components"
          aria-label="Search components"
          leftIcon={<SearchIcon size={14} aria-hidden="true" />}
          rightIcon={<Kbd size="sm">esc</Kbd>}
        />
        <p className="text-muted-foreground mt-3 px-2 text-[11px]">Recent</p>
        <div className="mt-1">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                'flex justify-between rounded-sm px-2 py-1.5 text-xs',
                index === 0 && 'bg-muted',
              )}
            >
              <span className="text-foreground">{item.label}</span>
              <span className="text-muted-foreground font-mono text-[11px]">{item.family}</span>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
