export type PlainDate = string;

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const PLAIN_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

function pad(value: number, length = 2) {
  return String(value).padStart(length, '0');
}

export function toUTC(date: PlainDate) {
  const match = PLAIN_DATE.exec(date);
  if (!match) return Number.NaN;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function fromUTC(time: number): PlainDate {
  const date = new Date(time);
  return `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function parse(value: string | null | undefined): PlainDate | null {
  if (!value) return null;
  const time = toUTC(value);
  if (Number.isNaN(time)) return null;
  return fromUTC(time) === value ? value : null;
}

export function today(timeZone?: string): PlainDate {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function getParts(date: PlainDate) {
  const value = new Date(toUTC(date));
  return {
    year: value.getUTCFullYear(),
    month: value.getUTCMonth() + 1,
    day: value.getUTCDate(),
  };
}

export function dayOfWeek(date: PlainDate): Weekday {
  return new Date(toUTC(date)).getUTCDay() as Weekday;
}

export function addDays(date: PlainDate, amount: number): PlainDate {
  return fromUTC(toUTC(date) + amount * DAY_MS);
}

export function addMonths(date: PlainDate, amount: number): PlainDate {
  const { year, month, day } = getParts(date);
  const target = new Date(Date.UTC(year, month - 1 + amount, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return fromUTC(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(day, lastDay)));
}

export function addYears(date: PlainDate, amount: number): PlainDate {
  return addMonths(date, amount * 12);
}

export function compare(a: PlainDate, b: PlainDate): -1 | 0 | 1 {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function isBetween(date: PlainDate, start: PlainDate, end: PlainDate) {
  const [from, to] = start <= end ? [start, end] : [end, start];
  return date >= from && date <= to;
}

export function isSameMonth(a: PlainDate, b: PlainDate) {
  return a.slice(0, 7) === b.slice(0, 7);
}

export function startOfMonth(date: PlainDate): PlainDate {
  return `${date.slice(0, 7)}-01`;
}

export function endOfMonth(date: PlainDate): PlainDate {
  return addDays(addMonths(startOfMonth(date), 1), -1);
}

export function startOfWeek(date: PlainDate, weekStart: Weekday = 1): PlainDate {
  const offset = (dayOfWeek(date) - weekStart + 7) % 7;
  return addDays(date, -offset);
}

export function endOfWeek(date: PlainDate, weekStart: Weekday = 1): PlainDate {
  return addDays(startOfWeek(date, weekStart), 6);
}

export function monthGrid(month: PlainDate, weekStart: Weekday = 1): PlainDate[] {
  const first = startOfWeek(startOfMonth(month), weekStart);
  return Array.from({ length: 42 }, (_, index) => addDays(first, index));
}

export function differenceInDays(a: PlainDate, b: PlainDate) {
  return Math.round((toUTC(a) - toUTC(b)) / DAY_MS);
}

export function clamp(date: PlainDate, min?: PlainDate, max?: PlainDate): PlainDate {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

const SUNDAY_FIRST_REGIONS = new Set([
  'US',
  'CA',
  'MX',
  'BR',
  'JP',
  'KR',
  'TW',
  'HK',
  'IL',
  'IN',
  'PH',
  'ZA',
  'AU',
  'SA',
]);

type LocaleWithWeekInfo = Intl.Locale & {
  getWeekInfo?: () => { firstDay: number };
  weekInfo?: { firstDay: number };
};

export function weekStartFor(locale?: string): Weekday {
  try {
    const resolved = new Intl.Locale(
      locale ?? new Intl.DateTimeFormat().resolvedOptions().locale,
    ) as LocaleWithWeekInfo;
    const info = resolved.getWeekInfo?.() ?? resolved.weekInfo;
    if (info) return (info.firstDay % 7) as Weekday;
    const region = resolved.maximize().region;
    return region && SUNDAY_FIRST_REGIONS.has(region) ? 0 : 1;
  } catch {
    return 1;
  }
}

export function weekdayNames(
  locale: string | undefined,
  weekStart: Weekday = 1,
  width: 'narrow' | 'short' | 'long' = 'short',
) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: width, timeZone: 'UTC' });
  const sunday = Date.UTC(2023, 0, 1);
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(sunday + ((weekStart + index) % 7) * DAY_MS),
  );
}

export function format(
  date: PlainDate,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
) {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(toUTC(date));
}
