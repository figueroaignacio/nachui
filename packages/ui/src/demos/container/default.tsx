'use client';

import { Container } from '../../layout/container';

export function Default() {
  return (
    <div className="bg-hatch w-full rounded-lg py-8">
      <Container size="sm" align="center">
        <article className="bg-card rounded-lg p-6 shadow-sm">
          <p className="text-muted-foreground text-xs font-medium">Article</p>
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
