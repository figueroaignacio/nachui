import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  compare,
  dayOfWeek,
  differenceInDays,
  endOfMonth,
  format,
  isBetween,
  monthGrid,
  parse,
  startOfWeek,
  today,
  weekdayNames,
  weekStartFor,
} from './date';

describe('date', () => {
  it('parses only real calendar dates', () => {
    expect(parse('2026-11-09')).toBe('2026-11-09');
    expect(parse('2026-02-30')).toBeNull();
    expect(parse('2026-1-9')).toBeNull();
    expect(parse('')).toBeNull();
  });

  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2024-03-01', -1)).toBe('2024-02-29');
  });

  it('clamps the day when adding months', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-03-31', -1)).toBe('2026-02-28');
    expect(addMonths('2026-11-09', 14)).toBe('2028-01-09');
  });

  it('compares and checks ranges in either order', () => {
    expect(compare('2026-01-01', '2026-01-02')).toBe(-1);
    expect(compare('2026-01-02', '2026-01-02')).toBe(0);
    expect(isBetween('2026-11-10', '2026-11-12', '2026-11-09')).toBe(true);
    expect(isBetween('2026-11-13', '2026-11-09', '2026-11-12')).toBe(false);
  });

  it('knows the weekday and the start of the week', () => {
    expect(dayOfWeek('2026-11-01')).toBe(0);
    expect(startOfWeek('2026-11-01', 1)).toBe('2026-10-26');
    expect(startOfWeek('2026-11-01', 0)).toBe('2026-11-01');
  });

  it('builds a six week grid that starts on the week start', () => {
    const grid = monthGrid('2026-11-15', 1);
    expect(grid).toHaveLength(42);
    expect(grid[0]).toBe('2026-10-26');
    expect(grid[41]).toBe('2026-12-06');
  });

  it('measures the distance in days', () => {
    expect(differenceInDays('2026-12-06', '2026-11-23')).toBe(13);
    expect(endOfMonth('2028-02-10')).toBe('2028-02-29');
  });

  it('formats in UTC so the day never shifts', () => {
    expect(format('2026-11-09', 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })).toBe(
      'November 9, 2026',
    );
  });

  it('returns a plain date for today', () => {
    expect(parse(today())).not.toBeNull();
  });

  it('reads the first day of the week from the locale', () => {
    expect(weekStartFor('en-US')).toBe(0);
    expect(weekStartFor('es-ES')).toBe(1);
    expect(weekdayNames('en-US', 1, 'short')[0]).toBe('Mon');
  });
});
