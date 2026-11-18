'use client';

import { InlineCitation } from '../../ai/inline-citation';
import { StreamText } from '../../lib/arrival';
import { usePlayback } from '../../lib/use-playback';

const ROUNDING = [
  {
    url: 'https://docs.stripe.com/currencies',
    title: 'Supported currencies and rounding',
    description: 'Amounts are in the smallest currency unit, so round once at the end.',
  },
  {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat',
    title: 'Intl.NumberFormat',
    description: 'Formats numbers and currencies for the reader’s locale.',
  },
];

const TAX = [
  {
    url: 'https://taxation-customs.ec.europa.eu/taxation/vat_en',
    title: 'VAT in the European Union',
  },
];

const OPENING =
  'The total was rounding before the discount, so a 15% coupon on 126.00 lost a cent. Round once, after tax,'.split(
    ' ',
  );
const CLOSING = 'Tax rates still come from the shipping address'.split(' ');
const CITED = OPENING.length + 1;
const TOTAL = CITED + CLOSING.length + 1;

export function Default() {
  const { step, rootProps } = usePlayback<HTMLParagraphElement>(TOTAL, 75);

  return (
    <p {...rootProps} className="text-foreground min-h-28 max-w-lg text-sm leading-7">
      <StreamText text={OPENING.slice(0, step).join(' ')} />{' '}
      {step >= CITED ? (
        <>
          <InlineCitation sources={ROUNDING}>and only when you display the amount</InlineCitation>.{' '}
          <StreamText text={CLOSING.slice(0, step - CITED).join(' ')} />{' '}
        </>
      ) : null}
      {step >= TOTAL ? (
        <>
          <InlineCitation sources={TAX} />.
        </>
      ) : null}
    </p>
  );
}
