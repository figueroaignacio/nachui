import { InlineCitation } from '../../ai/inline-citation';

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

export function Default() {
  return (
    <p className="text-foreground max-w-lg text-sm leading-7">
      The total was rounding before the discount, so a 15% coupon on 126.00 lost a cent. Round once,
      after tax,{' '}
      <InlineCitation sources={ROUNDING}>and only when you display the amount</InlineCitation>. Tax
      rates still come from the shipping address <InlineCitation sources={TAX} />.
    </p>
  );
}
