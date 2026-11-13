'use client';

import { Avatar } from '@repo/ui/components/avatar';
import { DropdownMenu } from '@repo/ui/components/dropdown-menu';
import { ChevronsUpDownIcon } from '@repo/ui/icons/chevrons-up-down';
import { cn } from '@repo/ui/lib/cn';
import { useRouter } from 'next/navigation';
import { useSession } from './session';

export function initials(name: string): string {
  return name
    .split(/[\s-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/** The account row at the bottom of the sidebar, or just the avatar when it is collapsed. */
export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { user, signOut } = useSession();
  const router = useRouter();
  const label = user.name ?? user.login;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Account, ${label}`}
          className={cn(
            'hover:bg-muted focus-visible:ring-ring flex w-full min-w-0 items-center gap-2.5 rounded-sm text-start transition-colors focus-visible:ring-2 focus-visible:outline-none',
            compact ? 'size-8 justify-center rounded-full' : 'p-1.5',
          )}
        >
          <Avatar size="sm" className="shrink-0">
            {user.avatarUrl ? <Avatar.Image src={user.avatarUrl} alt="" /> : null}
            <Avatar.Fallback>{initials(label)}</Avatar.Fallback>
          </Avatar>
          {compact ? null : (
            <>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-sm font-medium">{label}</span>
                <span className="text-muted-foreground truncate font-mono text-xs">
                  @{user.login}
                </span>
              </span>
              <ChevronsUpDownIcon size={14} className="text-muted-foreground shrink-0" />
            </>
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="w-60">
        <DropdownMenu.Item onSelect={() => router.push('/projects')}>Projects</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => router.push('/settings')}>Settings</DropdownMenu.Item>
        <DropdownMenu.Item
          onSelect={() => window.open('https://nachui.tech/docs', '_blank', 'noopener')}
        >
          NachUI docs
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => void signOut()}>Sign out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
