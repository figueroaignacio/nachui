'use client';

import * as React from 'react';
import { Breadcrumb } from '../../components/breadcrumb';
import { Separator } from '../../components/separator';
import { Sidebar } from '../../components/sidebar';
import { BarChartIcon } from '../../icons/bar-chart';
import { BookIcon } from '../../icons/book';
import { FolderIcon } from '../../icons/folder';
import { GitCommitIcon } from '../../icons/git-commit';
import { HelpCircleIcon } from '../../icons/help-circle';
import { HomeIcon } from '../../icons/home';
import { LayersIcon } from '../../icons/layers';
import { UserCircleIcon } from '../../icons/user-circle';
import { UsersIcon } from '../../icons/users';

const STORAGE_KEY = 'demo-sidebar-open';
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readOpen() {
  return window.localStorage.getItem(STORAGE_KEY) !== 'false';
}

function writeOpen(open: boolean) {
  window.localStorage.setItem(STORAGE_KEY, String(open));
  listeners.forEach((listener) => listener());
}

const projects = [
  { name: 'storefront-web', status: 'Ready', updated: '2 minutes ago' },
  { name: 'payments-api', status: 'Building', updated: '14 minutes ago' },
  { name: 'docs-site', status: 'Ready', updated: 'yesterday' },
];

export function Default() {
  const open = React.useSyncExternalStore(subscribe, readOpen, () => true);

  return (
    <div className="border-border h-[520px] w-full overflow-hidden rounded-lg border">
      <Sidebar.Provider
        open={open}
        onOpenChange={writeOpen}
        shortcut="mod+b"
        className="h-full min-h-0"
      >
        <Sidebar label="Workspace navigation">
          <Sidebar.Header>
            <Sidebar.Menu>
              <Sidebar.Item icon={<LayersIcon />}>Northwind</Sidebar.Item>
            </Sidebar.Menu>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group label="Platform">
              <Sidebar.Menu>
                <Sidebar.Item href="#home" icon={<HomeIcon />}>
                  Home
                </Sidebar.Item>
                <Sidebar.Item href="#projects" icon={<FolderIcon />} active>
                  Projects
                </Sidebar.Item>
                <Sidebar.Item href="#team" icon={<UsersIcon />}>
                  Team
                </Sidebar.Item>
                <Sidebar.Item href="#activity" icon={<BarChartIcon />} badge={12}>
                  Activity
                </Sidebar.Item>
              </Sidebar.Menu>
            </Sidebar.Group>
            <Sidebar.Group label="Resources" collapsible>
              <Sidebar.Menu>
                <Sidebar.Item href="#docs" icon={<BookIcon />}>
                  Documentation
                </Sidebar.Item>
                <Sidebar.Item href="#changelog" icon={<GitCommitIcon />}>
                  Changelog
                </Sidebar.Item>
                <Sidebar.Item href="#support" icon={<HelpCircleIcon />}>
                  Support
                </Sidebar.Item>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Menu>
              <Sidebar.Item icon={<UserCircleIcon />}>Ada Lovelace</Sidebar.Item>
            </Sidebar.Menu>
          </Sidebar.Footer>
          <Sidebar.Rail />
        </Sidebar>
        <Sidebar.Inset as="div">
          <header className="border-border flex h-12 shrink-0 items-center gap-2 border-b px-3">
            <Sidebar.Trigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#northwind">Northwind</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Page>Projects</Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          </header>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="border-border bg-card flex items-center justify-between rounded-md border px-4 py-3"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{project.name}</span>
                  <span className="text-muted-foreground text-xs">Updated {project.updated}</span>
                </div>
                <span className="text-muted-foreground text-xs">{project.status}</span>
              </div>
            ))}
          </div>
        </Sidebar.Inset>
      </Sidebar.Provider>
    </div>
  );
}
