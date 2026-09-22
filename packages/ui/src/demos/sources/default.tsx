'use client';

import { Sources } from '../../ai/sources';

export function Default() {
  return (
    <div className="w-full max-w-md">
      <Sources>
        <Sources.Trigger />
        <Sources.Content>
          <Sources.Item href="https://react.dev/reference/react/use" title="use – React" />
          <Sources.Item
            href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
            title="Disclosure pattern – ARIA Authoring Practices Guide"
          />
          <Sources.Item
            href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details"
            title="<details>: The Details disclosure element – MDN"
          />
        </Sources.Content>
      </Sources>
    </div>
  );
}
