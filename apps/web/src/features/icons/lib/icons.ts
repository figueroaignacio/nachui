import type { IconName } from '@repo/ui/registry';

export const ICON_CATEGORIES = [
  'arrows',
  'actions',
  'interface',
  'feedback',
  'objects',
  'layout',
  'development',
] as const;

export type IconCategory = (typeof ICON_CATEGORIES)[number];

export type IconEntry = {
  name: IconName;
  category: IconCategory;
  tags: string[];
};

/**
 * Metadata for the icon set. The drawings live in packages/ui/src/icons, one
 * file each, and stay free of app data; this table is what the catalog page
 * searches and groups by. getIconCatalog() fails the build when the two drift.
 */
export const ICON_CATALOG: IconEntry[] = [
  { name: 'arrow-up', category: 'arrows', tags: ['direction', 'north', 'top'] },
  { name: 'arrow-down', category: 'arrows', tags: ['direction', 'south', 'bottom'] },
  { name: 'arrow-left', category: 'arrows', tags: ['direction', 'west', 'back', 'previous'] },
  { name: 'arrow-right', category: 'arrows', tags: ['direction', 'east', 'next', 'forward'] },
  { name: 'arrow-up-right', category: 'arrows', tags: ['diagonal', 'external', 'open'] },
  { name: 'chevron-up', category: 'arrows', tags: ['caret', 'collapse', 'expand'] },
  { name: 'chevron-down', category: 'arrows', tags: ['caret', 'dropdown', 'expand', 'select'] },
  { name: 'chevron-left', category: 'arrows', tags: ['caret', 'back', 'previous'] },
  { name: 'chevron-right', category: 'arrows', tags: ['caret', 'next', 'forward', 'breadcrumb'] },
  { name: 'chevrons-up-down', category: 'arrows', tags: ['sort', 'select', 'combobox'] },

  { name: 'plus', category: 'actions', tags: ['add', 'new', 'create'] },
  { name: 'minus', category: 'actions', tags: ['remove', 'subtract', 'collapse'] },
  { name: 'x', category: 'actions', tags: ['close', 'cancel', 'dismiss', 'clear'] },
  { name: 'check', category: 'actions', tags: ['done', 'confirm', 'success', 'tick'] },
  { name: 'search', category: 'actions', tags: ['find', 'magnifier', 'lookup'] },
  { name: 'copy', category: 'actions', tags: ['duplicate', 'clipboard'] },
  { name: 'trash', category: 'actions', tags: ['delete', 'remove', 'bin'] },
  { name: 'pencil', category: 'actions', tags: ['edit', 'write', 'rename'] },
  { name: 'download', category: 'actions', tags: ['save', 'export', 'get'] },
  { name: 'upload', category: 'actions', tags: ['import', 'send', 'attach'] },
  { name: 'external-link', category: 'actions', tags: ['open', 'new tab', 'outbound'] },
  { name: 'refresh', category: 'actions', tags: ['reload', 'sync', 'retry', 'update'] },
  { name: 'filter', category: 'actions', tags: ['funnel', 'sort', 'refine'] },
  { name: 'more-horizontal', category: 'actions', tags: ['ellipsis', 'menu', 'options', 'dots'] },
  { name: 'more-vertical', category: 'actions', tags: ['ellipsis', 'kebab', 'options', 'dots'] },

  { name: 'menu', category: 'interface', tags: ['hamburger', 'navigation', 'burger'] },
  { name: 'settings', category: 'interface', tags: ['gear', 'cog', 'preferences', 'config'] },
  { name: 'home', category: 'interface', tags: ['house', 'start', 'dashboard'] },
  { name: 'user', category: 'interface', tags: ['person', 'account', 'profile', 'avatar'] },
  { name: 'users', category: 'interface', tags: ['people', 'team', 'group', 'members'] },
  { name: 'bell', category: 'interface', tags: ['notification', 'alert', 'ring'] },
  { name: 'calendar', category: 'interface', tags: ['date', 'schedule', 'event'] },
  { name: 'clock', category: 'interface', tags: ['time', 'history', 'recent', 'schedule'] },
  { name: 'eye', category: 'interface', tags: ['show', 'visible', 'preview', 'watch'] },
  { name: 'eye-off', category: 'interface', tags: ['hide', 'hidden', 'password', 'invisible'] },
  { name: 'lock', category: 'interface', tags: ['secure', 'private', 'password', 'auth'] },
  { name: 'star', category: 'interface', tags: ['favorite', 'rating', 'bookmark'] },
  { name: 'heart', category: 'interface', tags: ['like', 'favorite', 'love'] },
  { name: 'bookmark', category: 'interface', tags: ['save', 'read later', 'tag'] },

  { name: 'info', category: 'feedback', tags: ['information', 'about', 'note'] },
  { name: 'alert-circle', category: 'feedback', tags: ['error', 'warning', 'danger'] },
  { name: 'alert-triangle', category: 'feedback', tags: ['warning', 'caution', 'attention'] },
  { name: 'check-circle', category: 'feedback', tags: ['success', 'done', 'verified'] },
  { name: 'x-circle', category: 'feedback', tags: ['error', 'failed', 'remove'] },
  { name: 'help-circle', category: 'feedback', tags: ['question', 'support', 'faq'] },
  { name: 'loader', category: 'feedback', tags: ['spinner', 'loading', 'pending'] },

  { name: 'file', category: 'objects', tags: ['document', 'page', 'attachment'] },
  { name: 'folder', category: 'objects', tags: ['directory', 'files'] },
  { name: 'image', category: 'objects', tags: ['photo', 'picture', 'media'] },
  { name: 'mail', category: 'objects', tags: ['email', 'envelope', 'message', 'inbox'] },
  { name: 'link', category: 'objects', tags: ['chain', 'url', 'anchor'] },
  { name: 'globe', category: 'objects', tags: ['world', 'language', 'web', 'public'] },
  { name: 'code', category: 'development', tags: ['developer', 'source', 'snippet'] },
  { name: 'terminal', category: 'development', tags: ['cli', 'console', 'shell', 'command'] },
  { name: 'corner-down-left', category: 'arrows', tags: ['enter', 'return', 'submit'] },
  { name: 'chevrons-down-up', category: 'arrows', tags: ['collapse', 'fold', 'shrink'] },
  { name: 'maximize', category: 'arrows', tags: ['expand', 'fullscreen', 'enlarge'] },
  { name: 'repeat', category: 'arrows', tags: ['loop', 'retry', 'regenerate', 'cycle'] },
  { name: 'navigation', category: 'arrows', tags: ['compass', 'location', 'direction'] },
  { name: 'send', category: 'actions', tags: ['submit', 'message', 'paper plane'] },
  { name: 'share', category: 'actions', tags: ['export', 'social', 'network'] },
  { name: 'log-out', category: 'actions', tags: ['sign out', 'exit', 'leave'] },
  { name: 'wand', category: 'actions', tags: ['magic', 'ai', 'auto', 'generate'] },
  { name: 'cloud-upload', category: 'actions', tags: ['upload', 'sync', 'backup'] },
  { name: 'image-plus', category: 'actions', tags: ['add image', 'upload photo', 'attach'] },
  { name: 'user-plus', category: 'actions', tags: ['invite', 'add user', 'follow'] },
  { name: 'message-plus', category: 'actions', tags: ['new chat', 'compose', 'add comment'] },
  { name: 'file-up', category: 'actions', tags: ['upload file', 'import', 'document'] },
  { name: 'history', category: 'actions', tags: ['recent', 'undo', 'time', 'log'] },
  { name: 'paperclip', category: 'actions', tags: ['attachment', 'attach', 'clip'] },
  { name: 'sparkles', category: 'interface', tags: ['ai', 'magic', 'new', 'stars', 'shine'] },
  { name: 'cursor', category: 'interface', tags: ['pointer', 'click', 'mouse'] },
  { name: 'moon', category: 'interface', tags: ['dark mode', 'night', 'theme'] },
  { name: 'sun', category: 'interface', tags: ['light mode', 'day', 'theme', 'brightness'] },
  { name: 'toggle', category: 'interface', tags: ['switch', 'on', 'off', 'setting'] },
  { name: 'circle-dot', category: 'interface', tags: ['radio', 'record', 'selected', 'option'] },
  { name: 'check-square', category: 'interface', tags: ['checkbox', 'task', 'done', 'todo'] },
  { name: 'square', category: 'interface', tags: ['stop', 'box', 'checkbox', 'placeholder'] },
  { name: 'rectangle', category: 'interface', tags: ['card', 'box', 'shape', 'frame'] },
  { name: 'gauge', category: 'interface', tags: ['speed', 'progress', 'meter', 'dashboard'] },
  { name: 'key', category: 'interface', tags: ['password', 'api key', 'access', 'auth'] },
  { name: 'keyboard', category: 'interface', tags: ['shortcut', 'typing', 'hotkey'] },
  { name: 'laptop', category: 'interface', tags: ['device', 'computer', 'desktop', 'preview'] },
  { name: 'camera', category: 'interface', tags: ['photo', 'capture', 'avatar', 'picture'] },
  { name: 'inbox', category: 'interface', tags: ['messages', 'tray', 'empty', 'mail'] },
  { name: 'tag', category: 'interface', tags: ['label', 'badge', 'category', 'price'] },
  { name: 'languages', category: 'interface', tags: ['translate', 'locale', 'i18n', 'language'] },
  { name: 'user-circle', category: 'interface', tags: ['profile', 'account', 'avatar'] },
  { name: 'zap', category: 'interface', tags: ['fast', 'bolt', 'lightning', 'energy', 'quick'] },
  { name: 'shield', category: 'interface', tags: ['security', 'protected', 'safe', 'privacy'] },
  { name: 'rocket', category: 'interface', tags: ['launch', 'deploy', 'start', 'ship'] },
  {
    name: 'megaphone',
    category: 'interface',
    tags: ['announcement', 'banner', 'promo', 'broadcast'],
  },
  { name: 'puzzle', category: 'interface', tags: ['plugin', 'integration', 'piece', 'component'] },
  { name: 'palette', category: 'interface', tags: ['theme', 'color', 'design', 'paint'] },
  { name: 'credit-card', category: 'interface', tags: ['payment', 'billing', 'checkout', 'card'] },
  { name: 'gamepad', category: 'interface', tags: ['game', 'controller', 'play', 'sprite'] },
  { name: 'book', category: 'interface', tags: ['docs', 'guide', 'read', 'manual'] },
  { name: 'browser', category: 'interface', tags: ['window', 'web', 'app', 'tab'] },
  {
    name: 'message-circle',
    category: 'interface',
    tags: ['chat', 'comment', 'bubble', 'conversation'],
  },
  { name: 'cards', category: 'interface', tags: ['stack', 'deck', 'collection', 'group'] },
  { name: 'grip-vertical', category: 'interface', tags: ['drag', 'handle', 'reorder', 'resize'] },
  { name: 'file-text', category: 'objects', tags: ['document', 'pdf', 'text', 'notes'] },
  { name: 'archive', category: 'objects', tags: ['zip', 'compressed', 'box', 'storage'] },
  { name: 'folder-open', category: 'objects', tags: ['directory', 'expanded', 'files'] },
  { name: 'video', category: 'objects', tags: ['movie', 'camera', 'clip', 'media'] },
  { name: 'music', category: 'objects', tags: ['audio', 'song', 'sound', 'note'] },
  { name: 'package', category: 'objects', tags: ['box', 'npm', 'module', 'delivery'] },
  { name: 'layers', category: 'objects', tags: ['stack', 'levels', 'z-index', 'group'] },
  { name: 'bar-chart', category: 'objects', tags: ['analytics', 'stats', 'graph', 'report'] },
  { name: 'table', category: 'objects', tags: ['grid', 'data', 'rows', 'spreadsheet'] },
  { name: 'align-center', category: 'layout', tags: ['center', 'middle', 'align', 'box'] },
  {
    name: 'distribute-horizontal',
    category: 'layout',
    tags: ['spacing', 'spacer', 'distribute', 'gap'],
  },
  { name: 'layout-grid', category: 'layout', tags: ['dashboard', 'apps', 'grid', 'tiles'] },
  { name: 'layout', category: 'layout', tags: ['page', 'template', 'structure', 'sections'] },
  { name: 'panel-left', category: 'layout', tags: ['sidebar', 'drawer', 'navigation', 'menu'] },
  { name: 'panel-right', category: 'layout', tags: ['sidebar', 'drawer', 'aside', 'panel'] },
  { name: 'frame', category: 'layout', tags: ['crop', 'bounds', 'artboard', 'container'] },
  { name: 'grid', category: 'layout', tags: ['columns', 'table', 'cells', 'layout'] },
  {
    name: 'separator-horizontal',
    category: 'layout',
    tags: ['divider', 'split', 'resize', 'line'],
  },
  { name: 'text-cursor-input', category: 'layout', tags: ['input', 'field', 'form', 'text'] },
  { name: 'type', category: 'layout', tags: ['typography', 'font', 'text', 'heading'] },
  { name: 'git-commit', category: 'development', tags: ['git', 'commit', 'version', 'history'] },
  { name: 'git-merge', category: 'development', tags: ['git', 'merge', 'branch', 'pull request'] },
  { name: 'route', category: 'development', tags: ['path', 'routing', 'flow', 'steps'] },
  { name: 'server', category: 'development', tags: ['api', 'backend', 'database', 'hosting'] },
];

export function iconComponentName(name: string) {
  return `${name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}Icon`;
}

export function iconCliCommand(name: string) {
  return `npx nachui add icons/${name}`;
}

export function iconUsageSnippet(name: string) {
  const component = iconComponentName(name);
  return `import { ${component} } from '@/components/ui/${name}';\n\n<${component} size={16} />`;
}
