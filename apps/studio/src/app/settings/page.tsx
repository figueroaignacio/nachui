'use client';

import { AlertDialog } from '@repo/ui/components/alert-dialog';
import { Avatar } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { cn } from '@repo/ui/lib/cn';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { initials } from '@/features/shell/account-menu';
import { AppShell, MobileBar } from '@/features/shell/app-shell';
import { pill } from '@/features/shell/pill';
import { useSession } from '@/features/shell/session';
import { connectReposUrl, studioApi } from '@/lib/api';

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-border flex flex-col gap-3 border-b px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-muted-foreground text-sm">{description}</span>
      </div>
      {children}
    </div>
  );
}

function Settings() {
  const { user, usage, signOut, refreshUser } = useSession();
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const label = user.name ?? user.login;
  const ratio = usage && usage.limit > 0 ? Math.min(usage.used / usage.limit, 1) : 0;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 py-10 sm:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Settings</h1>

      <section aria-label="Account" className="border-border bg-card rounded-lg border">
        <div className="flex items-center gap-4 px-5 py-4">
          <Avatar size="lg">
            {user.avatarUrl ? <Avatar.Image src={user.avatarUrl} alt="" /> : null}
            <Avatar.Fallback>{initials(label)}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <span className="font-medium">{label}</span>
            <span className="text-muted-foreground font-mono text-xs">
              @{user.login} · signed in with GitHub
            </span>
          </div>
          <Button variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </section>

      <section aria-labelledby="usage" className="border-border bg-card rounded-lg border">
        <Row title="Usage today" description="Resets at midnight UTC.">
          <div className="flex w-full flex-col gap-2 sm:w-72">
            <div className="flex justify-between text-sm">
              <span id="usage">Generations</span>
              <span className="font-mono tabular-nums">
                {usage ? `${usage.used} / ${usage.limit}` : '-'}
              </span>
            </div>
            <div
              role="meter"
              aria-labelledby="usage"
              aria-valuemin={0}
              aria-valuemax={usage?.limit ?? 0}
              aria-valuenow={usage?.used ?? 0}
              className="bg-muted h-1.5 rounded-full"
            >
              <span
                className="bg-foreground block h-full rounded-full"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Tokens</span>
              <span className="font-mono tabular-nums">
                {usage ? usage.tokens.toLocaleString() : '-'}
              </span>
            </div>
          </div>
        </Row>
      </section>

      <section aria-label="GitHub" className="border-border bg-card rounded-lg border">
        <Row
          title="Repository access"
          description={
            user.hasRepoAccess
              ? 'Connected. The Studio can open pull requests in repositories you can push to.'
              : 'Not connected. You are asked the first time you open a pull request.'
          }
        >
          {user.hasRepoAccess ? (
            <Button
              variant="outline"
              loading={busy}
              onClick={async () => {
                setBusy(true);
                await studioApi.disconnectRepos().catch(() => undefined);
                setBusy(false);
                refreshUser();
              }}
            >
              Disconnect
            </Button>
          ) : (
            <a href={connectReposUrl('/settings')} className={pill({ variant: 'outline' })}>
              Connect GitHub
            </a>
          )}
        </Row>
      </section>

      <section
        aria-label="Delete account"
        className="border-destructive-border bg-card rounded-lg border"
      >
        <Row
          title="Delete account"
          description="Removes your projects, versions and chats. This cannot be undone."
        >
          <AlertDialog>
            <AlertDialog.Trigger asChild>
              <Button
                variant="outline"
                className={cn('text-destructive-text border-destructive-border')}
              >
                Delete account
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Delete your account?</AlertDialog.Title>
                <AlertDialog.Description>
                  Every project, version and chat goes with it. Pull requests already opened stay on
                  GitHub.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Keep it</AlertDialog.Cancel>
                <AlertDialog.Action
                  variant="destructive"
                  onClick={async () => {
                    await studioApi.deleteAccount();
                    router.replace('/login');
                  }}
                >
                  Delete account
                </AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </Row>
      </section>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <AppShell>
      <MobileBar title="Settings" />
      <Settings />
    </AppShell>
  );
}
