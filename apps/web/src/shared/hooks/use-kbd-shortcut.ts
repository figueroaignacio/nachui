import { useEffect, useEffectEvent, useSyncExternalStore } from 'react';

const MODIFIERS = ['mod', 'meta', 'cmd', 'ctrl', 'shift', 'alt'];

interface KbdShortcutOptions {
  /** Fire even when focus is in an input, textarea, select or contenteditable. */
  allowInEditable?: boolean;
}

function isMacPlatform() {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? '';
  return /mac|iphone|ipad|ipod/i.test(platform);
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

const subscribeNoop = () => () => {};

/** Label for the `mod` key: `⌘` on Apple platforms, `ctrl` elsewhere (and on the server). */
export function useModKeyLabel() {
  const isMac = useSyncExternalStore(subscribeNoop, isMacPlatform, () => false);
  return isMac ? '⌘' : 'ctrl';
}

/**
 * Binds a global shortcut. `mod` is Cmd on Apple platforms and Ctrl elsewhere;
 * `ctrl` and `meta`/`cmd` match those exact keys. The callback can return
 * `false` to signal it did nothing, which leaves the browser default intact.
 */
export function useKbdShortcut(
  keys: string[],
  callback: (e: KeyboardEvent) => boolean | void,
  options: KbdShortcutOptions = {},
) {
  const keysString = keys.join('+');
  const { allowInEditable = false } = options;
  const onMatch = useEffectEvent(callback);

  useEffect(() => {
    const currentKeys = keysString.split('+');
    const targetKey = currentKeys.find((k) => !MODIFIERS.includes(k));
    const isMac = isMacPlatform();
    const needsMod = currentKeys.includes('mod');
    const needsMeta =
      currentKeys.includes('meta') || currentKeys.includes('cmd') || (needsMod && isMac);
    const needsCtrl = currentKeys.includes('ctrl') || (needsMod && !isMac);
    const needsShift = currentKeys.includes('shift');
    const needsAlt = currentKeys.includes('alt');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (
        event.key.toLowerCase() !== targetKey ||
        event.metaKey !== needsMeta ||
        event.ctrlKey !== needsCtrl ||
        event.shiftKey !== needsShift ||
        event.altKey !== needsAlt
      ) {
        return;
      }
      if (!allowInEditable && isEditableTarget(event.target)) return;

      if (onMatch(event) !== false) event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keysString, allowInEditable]);
}
