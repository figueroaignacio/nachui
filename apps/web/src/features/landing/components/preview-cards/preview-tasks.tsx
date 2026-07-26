import { Badge } from '@repo/ui/components/badge';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Label } from '@repo/ui/components/label';

export function PreviewTasks() {
  return (
    <div
      className="border-border bg-card flex flex-col gap-4 rounded-lg border p-5"
      role="region"
      aria-label="Task management widget"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Today's Tasks
        </span>
        <Badge variant="secondary" className="h-5 px-1.5 text-[9px] font-bold">
          2 PENDING
        </Badge>
      </div>
      <div className="space-y-4" role="list">
        <div className="flex items-start gap-3" role="listitem">
          <Checkbox id="task-1" defaultChecked />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="task-1"
              className="cursor-pointer text-xs font-medium text-zinc-400 line-through dark:text-zinc-500"
            >
              Review pull request #1043
            </Label>
          </div>
        </div>
        <div className="flex items-start gap-3" role="listitem">
          <Checkbox id="task-2" />
          <div className="grid gap-1 leading-none">
            <Label
              htmlFor="task-2"
              className="cursor-pointer text-xs font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Deploy new design tokens
            </Label>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Due in 2 hours</span>
          </div>
        </div>
        <div className="flex items-start gap-3" role="listitem">
          <Checkbox id="task-3" />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="task-3"
              className="cursor-pointer text-xs font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Write release notes
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
