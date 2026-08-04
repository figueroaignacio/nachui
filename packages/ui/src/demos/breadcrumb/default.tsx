'use client';

import { Fragment } from 'react';

import { Breadcrumb } from '../../components/breadcrumb';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Components', isPage: true },
];

export function Default() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        {items.map((item, index) => (
          <Fragment key={index}>
            <Breadcrumb.Item>
              {item.isPage ? (
                <Breadcrumb.Page>{item.label}</Breadcrumb.Page>
              ) : (
                <Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
              )}
            </Breadcrumb.Item>
            {index < items.length - 1 && <Breadcrumb.Separator />}
          </Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb>
  );
}
