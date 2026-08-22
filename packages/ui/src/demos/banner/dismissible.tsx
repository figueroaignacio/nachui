'use client';

import { useState } from 'react';
import { Banner } from '../../components/banner';
import { Button } from '../../components/button';

export function Dismissible() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex w-full max-w-lg flex-col items-start gap-3">
      <Banner key={key} variant="info" onClose={() => {}}>
        <Banner.Content>
          <Banner.Title>Your trial ends in 3 days</Banner.Title>
          <Banner.Description>
            After Mar 20 the workspace drops to the free plan and keeps one project.
          </Banner.Description>
        </Banner.Content>
        <Banner.Action href="#plans">Compare plans</Banner.Action>
      </Banner>
      <Button variant="ghost" size="sm" onClick={() => setKey((k) => k + 1)}>
        Show the banner again
      </Button>
    </div>
  );
}
