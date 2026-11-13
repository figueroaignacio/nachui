'use client';

import { Sidebar } from '@repo/ui/components/sidebar';
import { cn } from '@repo/ui/lib/cn';
import * as React from 'react';
import { PageSkeleton } from './page-skeleton';
import { ProjectsProvider } from './projects-store';
import { SessionProvider } from './session';
import { StudioSidebar } from './studio-sidebar';

/**
 * Signed in pages: the session, the shared project list and the sidebar. Pages that scroll
 * as a whole leave `fixed` off; the workspace sets it and manages its own panels.
 */
export function AppShell({
  children,
  sidebarOpen = true,
  fixed = false,
}: {
  children: React.ReactNode;
  sidebarOpen?: boolean;
  fixed?: boolean;
}) {
  return (
    <SessionProvider fallback={<PageSkeleton />}>
      <ProjectsProvider>
        <Sidebar.Provider defaultOpen={sidebarOpen} shortcut="mod+b" className="h-dvh min-h-0">
          <StudioSidebar />
          <Sidebar.Inset
            as="div"
            className={cn(
              'min-h-0 max-md:m-0 max-md:rounded-none max-md:border-0',
              fixed ? 'overflow-hidden' : 'overflow-y-auto',
            )}
          >
            {children}
          </Sidebar.Inset>
        </Sidebar.Provider>
      </ProjectsProvider>
    </SessionProvider>
  );
}

/** The bar that opens the sidebar on phones, where it lives in a sheet. */
export function MobileBar({ title }: { title: string }) {
  return (
    <div className="border-border bg-background/90 sticky top-0 z-20 flex h-12 items-center gap-2 border-b px-2 backdrop-blur md:hidden">
      <Sidebar.Trigger className="size-10" />
      <span className="truncate text-sm font-medium">{title}</span>
    </div>
  );
}
