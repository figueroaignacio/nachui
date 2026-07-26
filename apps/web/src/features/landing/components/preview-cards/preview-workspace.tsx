import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Progress } from '@repo/ui/components/progress';
import { Select } from '@repo/ui/components/select';
import { Switch } from '@repo/ui/components/switch';

export function PreviewWorkspace() {
  return (
    <div
      className="border-border bg-card flex flex-col gap-4 rounded-lg border p-5"
      role="region"
      aria-label="Workspace Settings Widget"
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Workspace Settings
        </span>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
          Configure environment preferences
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            label="Workspace ID"
            defaultValue="nach-design-system"
            className="bg-muted/40 border-zinc-200 text-xs text-zinc-900 dark:border-zinc-800 dark:text-zinc-50"
            aria-describedby="workspace-id-desc"
          />
          <p id="workspace-id-desc" className="mt-1 text-[9px] text-zinc-400 dark:text-zinc-500">
            Your workspace URL:{' '}
            <span className="font-mono text-zinc-600 dark:text-zinc-300">
              nachui.com/nach-design-system
            </span>
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="env-select" className="text-xs">
            Deployment Target
          </Label>
          <Select
            id="env-select"
            defaultValue="production"
            className="bg-muted/40 border-zinc-200 text-xs text-zinc-950 dark:border-zinc-800 dark:text-zinc-50"
          >
            <option value="development">Development</option>
            <option value="staging">Staging (edge)</option>
            <option value="production">Production (multi-region)</option>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="maintenance-switch" className="text-xs">
              Maintenance Mode
            </Label>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500">
              Route traffic to custom loading screen
            </p>
          </div>
          <Switch id="maintenance-switch" defaultChecked={false} />
        </div>

        <div className="space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-900/50">
          <div className="flex justify-between text-[9px] font-bold tracking-widest uppercase">
            <span className="text-zinc-400 dark:text-zinc-500">API Usage Cap</span>
            <span className="text-zinc-900 dark:text-zinc-50">92%</span>
          </div>
          <Progress value={92} aria-label="API rate limit usage" />
          <p className="text-right text-[9px] text-zinc-400 dark:text-zinc-500">
            9,234,101 / 10,000,000 reqs
          </p>
        </div>
      </div>
    </div>
  );
}
