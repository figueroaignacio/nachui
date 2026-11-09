'use client';

import { Sidebar } from '../../components/sidebar';
import { BarChartIcon } from '../../icons/bar-chart';
import { FolderIcon } from '../../icons/folder';
import { HomeIcon } from '../../icons/home';
import { InboxIcon } from '../../icons/inbox';
import { SettingsIcon } from '../../icons/settings';
import { UsersIcon } from '../../icons/users';

export function Icon() {
  return (
    <div className="border-border h-[420px] w-full overflow-hidden rounded-lg border">
      <Sidebar.Provider defaultOpen={false} className="h-full min-h-0">
        <Sidebar collapsible="icon" label="Workspace navigation">
          <Sidebar.Content>
            <Sidebar.Group label="Platform">
              <Sidebar.Menu>
                <Sidebar.Item href="#home" icon={<HomeIcon />}>
                  Home
                </Sidebar.Item>
                <Sidebar.Item href="#inbox" icon={<InboxIcon />} badge={4}>
                  Inbox
                </Sidebar.Item>
                <Sidebar.Item href="#projects" icon={<FolderIcon />} active>
                  Projects
                </Sidebar.Item>
                <Sidebar.Item href="#team" icon={<UsersIcon />}>
                  Team
                </Sidebar.Item>
                <Sidebar.Item href="#reports" icon={<BarChartIcon />}>
                  Reports
                </Sidebar.Item>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Menu>
              <Sidebar.Item href="#settings" icon={<SettingsIcon />}>
                Settings
              </Sidebar.Item>
            </Sidebar.Menu>
          </Sidebar.Footer>
        </Sidebar>
        <Sidebar.Inset as="div">
          <header className="border-border flex h-12 shrink-0 items-center gap-2 border-b px-3">
            <Sidebar.Trigger />
            <span className="text-sm font-medium">Projects</span>
          </header>
          <div className="text-muted-foreground p-4 text-sm">
            Hover or focus an icon to see its label. Open the sidebar to read them inline.
          </div>
        </Sidebar.Inset>
      </Sidebar.Provider>
    </div>
  );
}
