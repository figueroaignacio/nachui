import { Badge } from '@repo/ui/components/badge';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Label } from '@repo/ui/components/label';
import { Radio } from '@repo/ui/components/radio';
import { Spinner } from '@repo/ui/components/spinner';
import { Switch } from '@repo/ui/components/switch';

export function PreviewControls() {
  return (
    <div
      className="border-border bg-card flex flex-col gap-4 rounded-lg border p-5"
      role="region"
      aria-label="Preference settings controls"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id="beta-enroll" defaultChecked />
          <Label
            htmlFor="beta-enroll"
            className="cursor-pointer text-xs font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Beta features enabled
          </Label>
        </div>
        <Badge
          variant="outline"
          className="h-4 border-zinc-300 text-[8px] font-bold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          OPT-IN
        </Badge>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-900/50">
        <div className="space-y-0.5">
          <Label
            htmlFor="autosave"
            className="cursor-pointer text-xs font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Auto-save workspace
          </Label>
          <p className="text-[9px] text-zinc-400 dark:text-zinc-500">
            Instantly sync edits to cloud
          </p>
        </div>
        <Switch id="autosave" defaultChecked />
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-3 dark:border-zinc-900/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Radio name="billing" id="monthly" value="monthly" />
            <Label
              htmlFor="monthly"
              className="cursor-pointer text-xs font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Monthly
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio name="billing" id="annual" value="annual" defaultChecked />
            <Label
              htmlFor="annual"
              className="cursor-pointer text-xs font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Annual <span className="text-primary ml-0.5 text-[9px] font-bold">(Save 20%)</span>
            </Label>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5" aria-live="polite">
          <span className="text-[9px] text-zinc-400 dark:text-zinc-500">Syncing</span>
          <Spinner size="sm" />
        </div>
      </div>
    </div>
  );
}
