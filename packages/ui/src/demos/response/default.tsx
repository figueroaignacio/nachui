'use client';

import { CodeBlock } from '../../ai/code-block';
import { Response } from '../../ai/response';
import { StreamText } from '../../lib/arrival';
import { usePlayback } from '../../lib/use-playback';

const INTRO =
  'The total was rounded before the discount, so a 15% coupon on 126.00 lost a cent. Three changes fix it:';

const POINTS = [
  'Apply the discount to the raw subtotal.',
  'Add tax to the discounted amount.',
  'Round once, when the total is displayed.',
];

const CODE = `const discounted = applyDiscount(subtotal, coupon);
const total = round(discounted + tax(discounted));`;

const WORDS = INTRO.split(' ');
const TOTAL = WORDS.length + POINTS.length + 2;

export function Default() {
  const { step, playing, rootProps } = usePlayback(TOTAL, 70);
  const points = Math.max(0, step - WORDS.length);

  return (
    <div {...rootProps} className="w-full max-w-lg">
      {step === 0 ? (
        <Response.Skeleton />
      ) : (
        <Response isStreaming={playing}>
          <p>
            <StreamText text={WORDS.slice(0, step).join(' ')} />
          </p>
          {points > 0 ? (
            <ul>
              {POINTS.slice(0, points).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}
          {points > POINTS.length ? (
            <CodeBlock code={CODE} language="ts">
              <CodeBlock.CopyButton />
              <CodeBlock.Content />
            </CodeBlock>
          ) : null}
        </Response>
      )}
    </div>
  );
}
