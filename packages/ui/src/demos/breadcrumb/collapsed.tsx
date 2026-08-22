'use client';

import { Breadcrumb } from '../../components/breadcrumb';
import { DropdownMenu } from '../../components/dropdown-menu';

export function Collapsed() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <DropdownMenu>
            <DropdownMenu.Trigger className="focus-visible:ring-ring flex items-center gap-1 focus-visible:ring-2 focus-visible:outline-none">
              <Breadcrumb.Ellipsis className="h-4 w-4" />
              <span className="sr-only">Show 2 hidden levels</span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              <DropdownMenu.Item>Projects</DropdownMenu.Item>
              <DropdownMenu.Item>storefront-api</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/dashboard/projects/storefront-api/deployments">
            Deployments
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>dpl_9fk2ax</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  );
}
