'use client';

import { Banner } from '../../components/banner';

export function Info() {
  return (
    <Banner variant="info" className="max-w-lg">
      <Banner.Content>
        <Banner.Title>Scheduled maintenance on Mar 14</Banner.Title>
        <Banner.Description>
          The dashboard is read only from 02:00 to 04:00 UTC. Running deploys are not affected.
        </Banner.Description>
      </Banner.Content>
      <Banner.Action href="#status">Status page</Banner.Action>
    </Banner>
  );
}
