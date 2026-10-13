import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins class names and drops falsy values', () => {
    expect(cn('px-2', false, null, undefined, '', 'py-1')).toBe('px-2 py-1');
  });

  it('accepts conditional objects and nested arrays', () => {
    expect(cn({ 'font-bold': true, italic: false }, ['text-sm', ['underline']])).toBe(
      'font-bold text-sm underline',
    );
  });

  it('lets later Tailwind classes win over conflicting earlier ones', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-muted-foreground', 'text-foreground')).toBe('text-foreground');
    expect(cn('disabled:opacity-50', 'disabled:opacity-40')).toBe('disabled:opacity-40');
  });

  it('keeps classes that only look similar', () => {
    expect(cn('p-2', 'px-4')).toBe('p-2 px-4');
    expect(cn('hover:bg-muted', 'bg-background')).toBe('hover:bg-muted bg-background');
  });

  it('returns an empty string for no input', () => {
    expect(cn()).toBe('');
  });
});
