import { Card } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { CheckIcon } from '@repo/ui/icons/check';
import { cn } from '@repo/ui/lib/cn';

const models = [
  { name: 'Balanced', description: 'Good for most tasks', context: '200K', selected: true },
  { name: 'Fast', description: 'Short answers, low latency', context: '128K', selected: false },
  { name: 'Reasoning', description: 'Thinks before it answers', context: '1M', selected: false },
];

export function PreviewModelPicker() {
  return (
    <Card className="p-1.5">
      <Input size="sm" placeholder="Search models" aria-label="Search models" />
      <p className="text-muted-foreground px-2.5 pt-3 pb-1 font-mono text-[10px]">Recommended</p>
      <ul className="space-y-0.5">
        {models.map((model) => (
          <li
            key={model.name}
            className={cn(
              'flex items-start gap-2 rounded-sm px-2.5 py-2',
              model.selected && 'bg-muted',
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="text-foreground text-xs font-medium">{model.name}</div>
              <div className="text-muted-foreground text-[11px]">{model.description}</div>
            </div>
            <span className="text-muted-foreground font-mono text-[10px]">{model.context}</span>
            <CheckIcon size={14} className={cn('mt-px', !model.selected && 'invisible')} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
