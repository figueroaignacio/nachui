'use client';

import { SlashIcon } from 'lucide-react';

import { Breadcrumb } from '../../components/breadcrumb';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Breadcrumb', href: null },
] as const;

export function CustomSeparator() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        {crumbs.map((crumb, index) => (
          <Breadcrumb.Item key={crumb.label}>
            {crumb.href ? (
              <Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
            ) : (
              <Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
            )}
            {index < crumbs.length - 1 && (
              <Breadcrumb.Separator>
                <SlashIcon className="h-3.5 w-3.5" />
              </Breadcrumb.Separator>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb.List>
    </Breadcrumb>
  );
}
