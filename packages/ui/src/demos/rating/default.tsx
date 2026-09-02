'use client';

import * as React from 'react';
import { Rating } from '../../components/rating';

export function Default() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <Rating value={value} onValueChange={setValue} aria-label="Rate this release" />
      <p className="text-muted-foreground text-xs">
        {value === 0 ? 'How was the 2.4 release?' : `You rated it ${value} out of 5`}
      </p>
    </div>
  );
}
