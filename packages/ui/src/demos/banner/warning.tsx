'use client';

import { Banner } from '../../components/banner';

export function Warning() {
  return (
    <Banner variant="warning" className="max-w-lg">
      <Banner.Content>
        <Banner.Title>Your API key expires in 5 days</Banner.Title>
        <Banner.Description>
          The key ending in 8f21 stops working on Mar 28. Rotate it before then to avoid failed
          requests.
        </Banner.Description>
      </Banner.Content>
      <Banner.Action href="#api-keys">Rotate key</Banner.Action>
    </Banner>
  );
}
