import { Card } from '@repo/ui/components/card';
import { Checkbox } from '@repo/ui/components/checkbox';

const tasks = [
  { label: 'Create your workspace', done: true },
  { label: 'Install the CLI', done: true },
  { label: 'Copy your first component', done: false },
  { label: 'Invite your team', done: false },
];

export function PreviewChecklist() {
  return (
    <Card>
      <Card.Header compact>
        <div className="flex items-baseline justify-between gap-2">
          <Card.Title className="text-sm font-semibold">Get started</Card.Title>
          <span className="text-muted-foreground font-mono text-[11px]">2 of 4</span>
        </div>
      </Card.Header>
      <Card.Content compact className="space-y-3">
        {tasks.map((task) => (
          <div key={task.label} className="flex items-center gap-2.5">
            <Checkbox defaultChecked={task.done} aria-label={task.label} />
            <span className="text-foreground text-xs">{task.label}</span>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
