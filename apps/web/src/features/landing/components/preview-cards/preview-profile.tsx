import { CheckmarkBadge01Icon, Mail01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';

export function PreviewProfile() {
  return (
    <div
      className="border-border bg-card flex flex-col gap-4 rounded-lg border p-5"
      role="region"
      aria-label="User Profile Widget"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            size="md"
            className="border-2 border-zinc-200 ring-2 ring-white dark:border-zinc-800 dark:ring-zinc-950"
          >
            <Avatar.Image
              src="https://github.com/figueroaignacio.png"
              alt="Ignacio Figueroa profile picture"
            />
            <Avatar.Fallback>IF</Avatar.Fallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Ignacio Figueroa
              <HugeiconsIcon
                icon={CheckmarkBadge01Icon}
                size={14}
                className="text-primary"
                aria-label="Verified Creator"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">@nach_ui</span>
              <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-bold">
                PRO CREATOR
              </Badge>
            </div>
          </div>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="size-8 rounded-full"
          aria-label="Add connection"
          rightIcon
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
        </Button>
      </div>

      <div className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
        Building high-performance design systems for modern web apps. Creator of{' '}
        <span className="font-bold text-zinc-900 underline decoration-zinc-400 underline-offset-4 dark:text-zinc-50 dark:decoration-zinc-600">
          NachUI
        </span>
        .
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-dashed border-zinc-100 pt-4 dark:border-zinc-800">
        <div className="flex gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">140+</span>
            <span className="text-[9px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Components
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">2.4M</span>
            <span className="text-[9px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Downloads
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="default"
          className="h-8 gap-2 px-3 text-xs font-bold"
          leftIcon={<HugeiconsIcon icon={Mail01Icon} size={14} />}
        >
          Hire Me
        </Button>
      </div>
    </div>
  );
}
