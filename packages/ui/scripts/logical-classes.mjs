/**
 * Finds Tailwind classes that pin layout to a physical side (ml-2, left-0,
 * rounded-r-md, text-left) in catalog source, so components flip on their own
 * under dir="rtl". Used by check-logical-classes.mjs and by its --fix mode.
 *
 * A few physical classes are correct on purpose and stay: safe area insets
 * (they follow the device, not the text), centering with left-1/2 plus a
 * translate, and components whose public API names a physical side (Sheet
 * side="left"). Those live in ALLOWED below, keyed by file.
 */

const PREFIXES = {
  ml: 'ms',
  mr: 'me',
  pl: 'ps',
  pr: 'pe',
  left: 'start',
  right: 'end',
  'border-l': 'border-s',
  'border-r': 'border-e',
  'rounded-l': 'rounded-s',
  'rounded-r': 'rounded-e',
  'rounded-tl': 'rounded-ss',
  'rounded-tr': 'rounded-se',
  'rounded-bl': 'rounded-es',
  'rounded-br': 'rounded-ee',
  'scroll-ml': 'scroll-ms',
  'scroll-mr': 'scroll-me',
  'scroll-pl': 'scroll-ps',
  'scroll-pr': 'scroll-pe',
};

const EXACT = {
  'text-left': 'text-start',
  'text-right': 'text-end',
  'float-left': 'float-start',
  'float-right': 'float-end',
  'border-l': 'border-s',
  'border-r': 'border-e',
  'rounded-l': 'rounded-s',
  'rounded-r': 'rounded-e',
};

const prefixPattern = Object.keys(PREFIXES)
  .sort((a, b) => b.length - a.length)
  .join('|');

export const PHYSICAL_CLASS = new RegExp(
  String.raw`(?<=^|[\s'"\x60{(])((?:[a-z0-9@\[\]&_=*.>+~-]+:)*)(-?)(?:(${prefixPattern})-([^\s'"\x60)]+)|(${Object.keys(EXACT).join('|')}))(?=$|[\s'"\x60)])`,
  'g',
);

const KEEP_VALUE = /safe-area|^1\/2$|^\[50%\]$|^\[calc\(50%/;

export const ALLOWED = {
  'components/sheet.tsx': 'side variants are named left and right',
  'components/drawer.tsx': 'side variants are named left and right',
  'components/toast.tsx': 'positions are named top-left, bottom-right and so on',
  'components/tooltip.tsx': 'side="left" and side="right" are physical by contract',
};

export function convertLine(line) {
  return line.replace(PHYSICAL_CLASS, (match, variants, negative, prefix, value, exact) => {
    if (exact) return `${variants}${negative}${EXACT[exact]}`;
    if (KEEP_VALUE.test(value)) return match;
    return `${variants}${negative}${PREFIXES[prefix]}-${value}`;
  });
}

export function findPhysical(line) {
  const found = [];
  for (const match of line.matchAll(PHYSICAL_CLASS)) {
    const value = match[4];
    if (value && KEEP_VALUE.test(value)) continue;
    found.push(match[0]);
  }
  return found;
}
