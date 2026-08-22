'use client';

import { Banner } from '../../components/banner';

export function Default() {
  return (
    <Banner className="max-w-lg">
      <Banner.Content>
        <Banner.Title>Deploy previews are now free on every plan</Banner.Title>
        <Banner.Description>
          Every pull request gets its own preview URL, with no extra build minutes.
        </Banner.Description>
      </Banner.Content>
      <Banner.Action href="#changelog">Read the changelog</Banner.Action>
    </Banner>
  );
}
