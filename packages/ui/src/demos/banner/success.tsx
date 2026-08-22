'use client';

import { Banner } from '../../components/banner';

export function Success() {
  return (
    <Banner variant="success" className="max-w-lg">
      <Banner.Content>
        <Banner.Title>acmestudio.dev is verified</Banner.Title>
        <Banner.Description>
          DNS records propagated and the certificate was issued. Production traffic is live.
        </Banner.Description>
      </Banner.Content>
      <Banner.Action href="#domains">View domain</Banner.Action>
    </Banner>
  );
}
