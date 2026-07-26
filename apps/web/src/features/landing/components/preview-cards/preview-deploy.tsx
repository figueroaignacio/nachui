import { Rocket01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Progress } from '@repo/ui/components/progress';

export function PreviewDeploy() {
  return (
    <div
      className="border-border bg-card flex flex-col gap-5 rounded-lg border p-5"
      role="region"
      aria-label="Deployment Status Tracker"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 shadow-inner dark:border-zinc-800 dark:bg-zinc-900/50">
          <HugeiconsIcon
            icon={Rocket01Icon}
            className="text-zinc-900 dark:text-zinc-50"
            size={22}
          />
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-50">
            Deploy to Vercel
            <Badge variant="secondary" className="h-5 animate-pulse text-[9px] font-bold">
              BUILDING
            </Badge>
          </div>
          <p className="mt-1 text-xs leading-normal text-zinc-500 dark:text-zinc-400">
            Push code to branch{' '}
            <span className="bg-muted rounded px-1 py-0.5 font-mono text-zinc-900 dark:text-zinc-100">
              main
            </span>{' '}
            to trigger automatic deployment.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-bold tracking-widest uppercase">
            <span className="text-zinc-400 dark:text-zinc-500">Deploying edge functions</span>
            <span className="text-zinc-900 dark:text-zinc-50">85%</span>
          </div>
          <Progress value={85} aria-label="Build progress" />
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 text-xs font-bold" size="sm">
            View Live Logs
          </Button>
          <Button variant="outline" className="flex-1 text-xs font-bold" size="sm">
            Cancel Build
          </Button>
        </div>
      </div>
    </div>
  );
}
