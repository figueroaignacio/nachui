'use client';

import { Reasoning } from '../../ai/reasoning';
import { StreamText } from '../../lib/arrival';
import { usePlayback } from '../../lib/use-playback';

const THOUGHT =
  'The total is rounded before the discount is applied, so a 15% coupon on 126.00 loses a cent. Rounding once, after tax, keeps the stored amount exact. I will change applyDiscount and rerun the checkout suite.';

const WORDS = THOUGHT.split(' ');

export function Default() {
  const { step, playing, rootProps } = usePlayback(WORDS.length + 4, 90);

  return (
    <div {...rootProps} className="w-full max-w-md">
      <Reasoning isStreaming={playing} duration={playing ? undefined : 4} defaultOpen>
        <Reasoning.Trigger />
        <Reasoning.Content>
          <StreamText text={WORDS.slice(0, step).join(' ')} />
        </Reasoning.Content>
      </Reasoning>
    </div>
  );
}
