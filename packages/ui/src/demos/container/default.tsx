'use client';

import { Container } from '../../layout/container';

export function Default() {
  return (
    <div className="border-border w-full rounded-xl border border-dashed py-8">
      <Container size="sm" align="center">
        <article className="border-border bg-card rounded-xl border p-6">
          <p className="text-primary text-xs font-medium tracking-wide uppercase">Article</p>
          <h3 className="mt-2 text-lg font-semibold">Readable by design</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            A container caps content at a comfortable measure and keeps it centered, so long text
            never stretches across the whole viewport. The dashed edge marks the page; the card
            stays inside the constraint.
          </p>
        </article>
      </Container>
    </div>
  );
}
