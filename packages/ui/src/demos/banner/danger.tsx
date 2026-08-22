'use client';

import { Banner } from '../../components/banner';

export function Danger() {
  return (
    <Banner variant="danger" className="max-w-lg">
      <Banner.Content>
        <Banner.Title>We could not charge your card</Banner.Title>
        <Banner.Description>
          The payment for invoice INV-2043 was declined. Update your billing details before Mar 20
          to keep the Team plan.
        </Banner.Description>
      </Banner.Content>
      <Banner.Action href="#billing">Update card</Banner.Action>
    </Banner>
  );
}
