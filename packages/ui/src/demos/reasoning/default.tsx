'use client';

import { Reasoning } from '../../ai/reasoning';

export function Default() {
  return (
    <div className="w-full max-w-md">
      <Reasoning duration={4}>
        <Reasoning.Trigger />
        <Reasoning.Content>
          The user wants a copy-paste component, so an npm package is off the table. I will read the
          registry first, then write the primitive with no runtime dependencies beyond the ones the
          library already ships.
        </Reasoning.Content>
      </Reasoning>
    </div>
  );
}
