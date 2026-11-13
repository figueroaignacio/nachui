'use client';

import { Progress } from '@repo/ui/components/progress';
import { Sidebar, useSidebar } from '@repo/ui/components/sidebar';
import { Spinner } from '@repo/ui/components/spinner';
import { LayoutGridIcon } from '@repo/ui/icons/layout-grid';
import { PlusIcon } from '@repo/ui/icons/plus';
import { SearchIcon } from '@repo/ui/icons/search';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { AccountMenu } from './account-menu';
import { Logo } from './logo';
import { groupProjects } from './project-groups';
import { useProjects } from './projects-store';
import { useSession } from './session';

function UsageCard() {
  const { usage } = useSession();
  if (!usage || usage.limit === 0) return null;
  const left = Math.max(usage.limit - usage.used, 0);
  return (
    <div className="border-border bg-card flex flex-col gap-2 rounded-md border px-3 py-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Generations today</span>
        <span className="font-mono tabular-nums">
          {usage.used} / {usage.limit}
        </span>
      </div>
      <Progress
        value={usage.used}
        max={usage.limit}
        aria-label={`${left} generations left today`}
        className="h-1"
      />
    </div>
  );
}

export function StudioSidebar() {
  const pathname = usePathname();
  const { projects, liveId } = useProjects();
  const { state, isMobile } = useSidebar();
  const compact = state === 'collapsed' && !isMobile;
  const groups = React.useMemo(() => groupProjects(projects ?? []), [projects]);

  return (
    <Sidebar collapsible="icon" variant="inset" label="Studio">
      <Sidebar.Header className="h-14 flex-row items-center justify-between gap-2 px-3 py-0">
        {compact ? null : <Logo />}
        <Sidebar.Trigger />
      </Sidebar.Header>

      <Sidebar.Menu className="px-2 pb-2">
        <Sidebar.Item
          asChild
          icon={<PlusIcon />}
          tooltip="New project"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground mb-2 h-9 justify-center rounded-full font-medium"
        >
          <Link href="/">New project</Link>
        </Sidebar.Item>
        <Sidebar.Item asChild icon={<SearchIcon />} tooltip="Search">
          <Link href="/projects?search=1">Search</Link>
        </Sidebar.Item>
        <Sidebar.Item
          asChild
          icon={<LayoutGridIcon />}
          tooltip="Projects"
          active={pathname === '/projects'}
        >
          <Link href="/projects">Projects</Link>
        </Sidebar.Item>
      </Sidebar.Menu>

      <Sidebar.Content>
        {compact
          ? null
          : groups.map((group) => (
              <Sidebar.Group key={group.label} label={group.label}>
                <Sidebar.Menu>
                  {group.projects.map((project) => (
                    <Sidebar.Item
                      key={project.id}
                      asChild
                      active={pathname === `/p/${project.id}`}
                      badge={
                        project.id === liveId ? (
                          <Spinner size="sm" aria-label="Generating" />
                        ) : undefined
                      }
                    >
                      <Link href={`/p/${project.id}`}>{project.name}</Link>
                    </Sidebar.Item>
                  ))}
                </Sidebar.Menu>
              </Sidebar.Group>
            ))}
      </Sidebar.Content>

      <Sidebar.Footer className="border-border gap-2.5 border-t">
        {compact ? null : <UsageCard />}
        <AccountMenu compact={compact} />
      </Sidebar.Footer>
    </Sidebar>
  );
}
