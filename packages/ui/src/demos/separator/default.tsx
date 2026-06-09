'use client';

import { Fragment } from 'react';

import { Separator } from '../../components/separator';

const navLinks = ['Docs', 'Components', 'Blog'] as const;

export function Default() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <h4 className="text-sm font-medium">NachUI</h4>
        <p className="text-muted-foreground text-sm">An open-source UI component library.</p>
      </div>
      <Separator />
      <div className="flex h-5 items-center gap-4 text-sm">
        {navLinks.map((link, index) => (
          <Fragment key={link}>
            {index > 0 && <Separator orientation="vertical" />}
            <span>{link}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
