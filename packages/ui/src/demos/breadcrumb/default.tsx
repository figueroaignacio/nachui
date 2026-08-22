import { Fragment } from 'react';

import { Breadcrumb } from '../../components/breadcrumb';

const crumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'storefront-api', href: '/dashboard/projects/storefront-api' },
  { label: 'Deployments', href: null },
];

export function Default() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.label}>
            <Breadcrumb.Item>
              {crumb.href ? (
                <Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
              ) : (
                <Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
              )}
            </Breadcrumb.Item>
            {index < crumbs.length - 1 && <Breadcrumb.Separator />}
          </Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb>
  );
}
