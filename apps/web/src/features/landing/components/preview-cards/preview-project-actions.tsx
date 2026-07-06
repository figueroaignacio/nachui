import { Delete02Icon, GlobalIcon, UserGroupIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '@repo/ui/components/badge';
import { Kbd } from '@repo/ui/components/kbd';
import { Label } from '@repo/ui/components/label';

export function PreviewProjectActions() {
  return (
    <div
      className="border-border bg-card flex flex-col gap-2 rounded-2xl border p-5"
      role="menu"
      aria-label="Project quick actions"
    >
      <Label className="mb-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
        Project Actions
      </Label>

      <div
        role="menuitem"
        tabIndex={0}
        className="group focus:ring-primary/20 flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors duration-200 outline-none hover:bg-zinc-100/80 focus:ring-1 dark:hover:bg-zinc-900/60"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={16}
              className="text-zinc-700 dark:text-zinc-300"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Invite Team</div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500">Add team members</div>
          </div>
        </div>
        <Kbd>⌘I</Kbd>
      </div>

      <div
        role="menuitem"
        tabIndex={0}
        className="group focus:ring-primary/20 flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors duration-200 outline-none hover:bg-zinc-100/80 focus:ring-1 dark:hover:bg-zinc-900/60"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <HugeiconsIcon
              icon={GlobalIcon}
              size={16}
              className="text-zinc-700 dark:text-zinc-300"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Deployments</div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
              Manage URLs & domains
            </div>
          </div>
        </div>
        <Kbd>⌘D</Kbd>
      </div>

      <div className="mt-2 border-t border-zinc-100 pt-3 dark:border-zinc-900/50">
        <div className="mb-2 flex items-center justify-between gap-2 px-2">
          <Label className="text-[10px] font-bold tracking-widest text-red-500 uppercase dark:text-red-400">
            Danger zone
          </Label>
          <Badge
            variant="destructive"
            className="h-4 border-none bg-red-100 px-1 text-[8px] leading-none font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400"
          >
            CRITICAL
          </Badge>
        </div>

        <div
          role="menuitem"
          tabIndex={0}
          className="group flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors duration-200 outline-none hover:bg-red-50 focus:ring-1 focus:ring-red-500/20 dark:hover:bg-red-950/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-100/60 group-hover:bg-red-100 dark:bg-red-950/50 dark:group-hover:bg-red-950">
              <HugeiconsIcon
                icon={Delete02Icon}
                size={16}
                className="text-red-600 dark:text-red-400"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-red-600 dark:text-red-400">Delete Project</div>
              <div className="text-[10px] text-red-400 dark:text-red-500/70">
                Permanently remove folder
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
