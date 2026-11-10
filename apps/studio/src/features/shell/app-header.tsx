'use client';

import { Avatar } from '@repo/ui/components/avatar';
import { DropdownMenu } from '@repo/ui/components/dropdown-menu';
import { cn } from '@repo/ui/lib/cn';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './logo';
import { useSession } from './session';
import { UsageMeter } from './usage-meter';

const NAV = [
  { href: '/', label: 'New' },
  { href: '/projects', label: 'Projects' },
] as const;

export function initials(name: string): string {
  return name
    .split(/[\s-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function AccountMenu() {
  const { user, signOut } = useSession();
  const router = useRouter();
  const label = user.name ?? user.login;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Account, ${label}`}
          className="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Avatar size="sm">
            {user.avatarUrl ? <Avatar.Image src={user.avatarUrl} alt="" /> : null}
            <Avatar.Fallback>{initials(label)}</Avatar.Fallback>
          </Avatar>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-60">
        <div className="flex flex-col px-3 py-2">
          <span className="truncate text-sm font-medium">{label}</span>
          <span className="text-muted-foreground truncate font-mono text-xs">@{user.login}</span>
        </div>
        <DropdownMenu.Separator />
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

export function AppHeader() {
  const pathname = usePathname();
  const { usage } = useSession();

  return (
    <header className="border-border bg-background/90 sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 backdrop-blur sm:px-5">
      <Logo />
      <nav aria-label="Main" className="flex items-center gap-1 text-sm">
        {NAV.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'focus-visible:ring-ring rounded-md px-2.5 py-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none',
                active ? 'bg-muted text-foreground' : 'text-muted-strong hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <span className="flex-1" />
      <UsageMeter usage={usage} />
      <AccountMenu />
    </header>
  );
}
