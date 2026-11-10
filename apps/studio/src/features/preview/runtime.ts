import { MODULE_PREFIX } from './bundle';

/** Versions the preview loads from esm.sh, matching what packages/ui is built with. */
export const PREVIEW_PINS = {
  react: '19.2.8',
  motion: '12.43.0',
  clsx: '2.1.1',
  tailwindMerge: '3.6.0',
  cva: '0.7.1',
  zod: '4.4.3',
  tailwind: '4.3.3',
} as const;

export function importMap(): Record<string, string> {
  const { react, motion, clsx, tailwindMerge, cva, zod } = PREVIEW_PINS;
  const external = '?external=react,react-dom';
  return {
    react: `https://esm.sh/react@${react}`,
    'react/jsx-runtime': `https://esm.sh/react@${react}/jsx-runtime`,
    'react-dom': `https://esm.sh/react-dom@${react}${external}`,
    'react-dom/client': `https://esm.sh/react-dom@${react}/client${external}`,
    motion: `https://esm.sh/motion@${motion}${external}`,
    'motion/react': `https://esm.sh/motion@${motion}/react${external}`,
    clsx: `https://esm.sh/clsx@${clsx}`,
    'tailwind-merge': `https://esm.sh/tailwind-merge@${tailwindMerge}`,
    'class-variance-authority': `https://esm.sh/class-variance-authority@${cva}?deps=clsx@${clsx}`,
    zod: `https://esm.sh/zod@${zod}`,
  };
}

const RUNTIME = String.raw`
const placeholder = new RegExp(${JSON.stringify(MODULE_PREFIX)} + '(\\d+)', 'g');
let reactRoot = null;
let urls = [];
let paths = {};
let React = null;
const post = (message) => parent.postMessage(message, '*');
const clean = (text) => String(text || '').replace(/blob:[^\s)]+?\/[0-9a-f-]{36}/g, (url) => {
  const index = urls.indexOf(url);
  return index === -1 ? url : (paths[index] || url);
});
const report = (error) => {
  const value = error && typeof error === 'object' ? error : { message: String(error) };
  post({ type: 'error', name: value.name || 'Error', message: clean(value.message), stack: clean(value.stack) });
};
window.addEventListener('error', (event) => report(event.error || event.message));
window.addEventListener('unhandledrejection', (event) => report(event.reason));
window.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data || event.source !== parent) return;
  if (data.type === 'theme') {
    document.documentElement.classList.toggle('dark', Boolean(data.dark));
    return;
  }
  if (data.type !== 'render') return;
  try {
    urls.forEach((url) => URL.revokeObjectURL(url));
    urls = [];
    paths = {};
    for (const module of data.modules) {
      const code = module.code.replace(placeholder, (_, id) => urls[Number(id)]);
      const url = URL.createObjectURL(new Blob([code + '\n//# sourceURL=' + module.path], { type: 'text/javascript' }));
      urls[module.id] = url;
      paths[module.id] = module.path;
    }
    React = React || (await import('react'));
    const { createRoot } = await import('react-dom/client');
    const entry = await import(urls[data.entry]);
    const Screen = entry.default;
    if (typeof Screen !== 'function') throw new Error('The screen has no default export to render.');
    class Boundary extends React.Component {
      constructor(props) { super(props); this.state = { failed: false }; }
      static getDerivedStateFromError() { return { failed: true }; }
      componentDidCatch(error) { report(error); }
      render() { return this.state.failed ? null : this.props.children; }
    }
    reactRoot = reactRoot || createRoot(document.getElementById('root'));
    reactRoot.render(React.createElement(Boundary, { key: data.key }, React.createElement(Screen)));
    post({ type: 'rendered' });
  } catch (error) {
    report(error);
  }
});
post({ type: 'ready' });
`;

/** The whole preview document. It runs in a sandboxed frame with an opaque origin. */
export function previewDocument(css: string, dark: boolean): string {
  return `<!doctype html>
<html lang="en"${dark ? ' class="dark"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script type="importmap">${JSON.stringify({ imports: importMap() })}</script>
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@${PREVIEW_PINS.tailwind}"></script>
<style type="text/tailwindcss">${css.replace(/<\/style/gi, '<\\/style')}</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Schibsted+Grotesk:wght@500;600;700&display=swap">
<style>html{--font-sans:'Geist',ui-sans-serif,system-ui,sans-serif;--font-heading:'Schibsted Grotesk','Geist',ui-sans-serif,sans-serif;--font-serif:'Geist',ui-serif,serif;--font-mono:'Geist Mono',ui-monospace,monospace;}html,body{margin:0;min-height:100%;}</style>
</head>
<body class="bg-background text-foreground antialiased">
<div id="root"></div>
<script type="module">${RUNTIME}</script>
</body>
</html>`;
}
