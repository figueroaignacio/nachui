const cache = new Map<string, Promise<{ path: string; code: string } | null>>();

/** NachUI sources for the preview, served by this app from packages/ui. */
export function loadCatalogFile(dir: string, name: string) {
  const key = `${dir}/${name}`;
  let pending = cache.get(key);
  if (!pending) {
    pending = fetch(`/api/catalog/${dir}/${name}`)
      .then((response) =>
        response.ok ? (response.json() as Promise<{ path: string; code: string }>) : null,
      )
      .catch(() => null);
    cache.set(key, pending);
    void pending.then((file) => {
      if (!file) cache.delete(key);
    });
  }
  return pending;
}

let css: Promise<string> | null = null;

export function loadPreviewCss(): Promise<string> {
  css ??= fetch('/api/catalog/css').then((response) => (response.ok ? response.text() : ''));
  return css;
}
