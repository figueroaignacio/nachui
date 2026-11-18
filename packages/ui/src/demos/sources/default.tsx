'use client';

import { useState } from 'react';
import { googleFavicon, Sources } from '../../ai/sources';
import { usePlayback } from '../../lib/use-playback';

const ITEMS = [
  { href: 'https://react.dev/reference/react/use', title: 'use – React' },
  {
    href: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
    title: 'Disclosure pattern – ARIA Authoring Practices Guide',
  },
  {
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details',
    title: '<details>: The Details disclosure element – MDN',
  },
];

export function Default() {
  const [open, setOpen] = useState(false);
  const { step, playing, rootProps } = usePlayback(ITEMS.length + 1, 700);
  const found = ITEMS.slice(0, step);

  return (
    <div {...rootProps} className="min-h-36 w-full max-w-md">
      <Sources
        getFavicon={googleFavicon}
        count={found.length}
        open={playing || open}
        onOpenChange={setOpen}
      >
        <Sources.Trigger />
        <Sources.Content>
          {found.map((item) => (
            <Sources.Item key={item.href} href={item.href} title={item.title} />
          ))}
        </Sources.Content>
      </Sources>
    </div>
  );
}
