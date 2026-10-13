import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useControllableState } from './use-controllable-state';

describe('useControllableState', () => {
  it('starts from defaultValue and updates itself when uncontrolled', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));

    expect(result.current[0]).toBe(1);

    act(() => result.current[1](2));

    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('follows the value prop and only reports changes when controlled', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 0, onChange }),
      { initialProps: { value: 5 } },
    );

    act(() => result.current[1](6));

    expect(onChange).toHaveBeenCalledWith(6);
    expect(result.current[0]).toBe(5);

    rerender({ value: 6 });
    expect(result.current[0]).toBe(6);
  });

  it('keeps reporting the same request while the parent ignores it', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: false, defaultValue: false, onChange }),
    );

    act(() => result.current[1](true));
    act(() => result.current[1](true));

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(result.current[0]).toBe(false);
  });

  it('skips onChange when the value does not change', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 'a', onChange }));

    act(() => result.current[1]('a'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('resolves functional updates against the latest value', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));

    act(() => {
      result.current[1]((count) => count + 1);
      result.current[1]((count) => count + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('keeps a stable setter across renders and uses the latest onChange', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ onChange }) => useControllableState({ defaultValue: 0, onChange }),
      { initialProps: { onChange: first } },
    );
    const setter = result.current[1];

    rerender({ onChange: second });
    expect(result.current[1]).toBe(setter);

    act(() => result.current[1](1));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(1);
  });
});
