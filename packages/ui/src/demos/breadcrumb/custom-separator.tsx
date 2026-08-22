import { Fragment } from 'react';

import { Breadcrumb } from '../../components/breadcrumb';

const crumbs = [
  { label: 'acme-studio', href: '/acme-studio' },
  { label: 'storefront-api', href: '/acme-studio/storefront-api' },
  { label: 'Settings', href: '/acme-studio/storefront-api/settings' },
  { label: 'Environment Variables', href: null },
] as const;

export function CustomSeparator() {
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
            {index < crumbs.length - 1 && (
              <Breadcrumb.Separator>
                <span aria-hidden="true">/</span>
              </Breadcrumb.Separator>
            )}
          </Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb>
  );
}
