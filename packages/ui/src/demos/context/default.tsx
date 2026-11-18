'use client';

import { Context } from '../../ai/context';
import { usePlayback } from '../../lib/use-playback';

const STEPS = 24;

export function Default() {
  const { step, rootProps } = usePlayback(STEPS, 90);
  const share = (tokens: number) => Math.round((tokens * step) / STEPS);

  return (
    <div {...rootProps} className="flex w-full justify-center py-8">
      <Context maxTokens={200000} usedTokens={share(84320)}>
        <Context.Trigger />
        <Context.Content align="center">
          <Context.Header />
          <Context.Body>
            <Context.Usage label="Input" tokens={share(61200)} />
            <Context.Usage label="Output" tokens={share(14100)} tone="info" />
            <Context.Usage label="Reasoning" tokens={share(6800)} tone="warning" />
            <Context.Usage label="Cached" tokens={share(2220)} tone="success" />
          </Context.Body>
          <Context.Footer>Costs are estimated from the model pricing you configure.</Context.Footer>
        </Context.Content>
      </Context>
    </div>
  );
}
