'use client';

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
          <Breadcrumb.Item key={index}>
            {item.isPage ? (
              <Breadcrumb.Page>{item.label}</Breadcrumb.Page>
            ) : (
              <Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
            )}
            {index < items.length - 1 && <Breadcrumb.Separator />}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb.List>
    </Breadcrumb>
  );
}
