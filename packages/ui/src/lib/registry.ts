// GENERATED FILE, DO NOT EDIT.
// Run `pnpm --filter @repo/ui generate:registry` after adding a component,
// a demo or a brick. The build fails if this file is out of date.

/** Families of components, and where each one lives. */
export const FAMILIES = [
  { id: 'ui', codeDir: 'src/components', docsSegment: 'elements/ui' },
  { id: 'layout', codeDir: 'src/layout', docsSegment: 'elements/layout' },
] as const;

export const COMPONENT_REGISTRY = {
  accordion: 'packages/ui/src/components/accordion.tsx',
  avatar: 'packages/ui/src/components/avatar.tsx',
  badge: 'packages/ui/src/components/badge.tsx',
  banner: 'packages/ui/src/components/banner.tsx',
  breadcrumb: 'packages/ui/src/components/breadcrumb.tsx',
  bubble: 'packages/ui/src/components/bubble.tsx',
  button: 'packages/ui/src/components/button.tsx',
  callout: 'packages/ui/src/components/callout.tsx',
  card: 'packages/ui/src/components/card.tsx',
  checkbox: 'packages/ui/src/components/checkbox.tsx',
  collapsible: 'packages/ui/src/components/collapsible.tsx',
  command: 'packages/ui/src/components/command.tsx',
  container: 'packages/ui/src/layout/container.tsx',
  'context-menu': 'packages/ui/src/components/context-menu.tsx',
  dialog: 'packages/ui/src/components/dialog.tsx',
  drawer: 'packages/ui/src/components/drawer.tsx',
  'dropdown-menu': 'packages/ui/src/components/dropdown-menu.tsx',
  empty: 'packages/ui/src/components/empty.tsx',
  'file-upload': 'packages/ui/src/components/file-upload.tsx',
  flex: 'packages/ui/src/layout/flex.tsx',
  frame: 'packages/ui/src/components/frame.tsx',
  grid: 'packages/ui/src/layout/grid.tsx',
  'icon-tile': 'packages/ui/src/components/icon-tile.tsx',
  input: 'packages/ui/src/components/input.tsx',
  kbd: 'packages/ui/src/components/kbd.tsx',
  label: 'packages/ui/src/components/label.tsx',
  message: 'packages/ui/src/components/message.tsx',
  'navigation-menu': 'packages/ui/src/components/navigation-menu.tsx',
  pagination: 'packages/ui/src/components/pagination.tsx',
  popover: 'packages/ui/src/components/popover.tsx',
  progress: 'packages/ui/src/components/progress.tsx',
  radio: 'packages/ui/src/components/radio.tsx',
  select: 'packages/ui/src/components/select.tsx',
  separator: 'packages/ui/src/components/separator.tsx',
  skeleton: 'packages/ui/src/components/skeleton.tsx',
  snippet: 'packages/ui/src/components/snippet.tsx',
  spinner: 'packages/ui/src/components/spinner.tsx',
  sprite: 'packages/ui/src/components/sprite.tsx',
  stack: 'packages/ui/src/layout/stack.tsx',
  steps: 'packages/ui/src/components/steps.tsx',
  switch: 'packages/ui/src/components/switch.tsx',
  table: 'packages/ui/src/components/table.tsx',
  tabs: 'packages/ui/src/components/tabs.tsx',
  timeline: 'packages/ui/src/components/timeline.tsx',
  toast: 'packages/ui/src/components/toast.tsx',
  tooltip: 'packages/ui/src/components/tooltip.tsx',
  tree: 'packages/ui/src/components/tree.tsx',
  typography: 'packages/ui/src/components/typography.tsx',
} as const;

/** Which family each component belongs to. */
export const COMPONENT_FAMILY = {
  accordion: 'ui',
  avatar: 'ui',
  badge: 'ui',
  banner: 'ui',
  breadcrumb: 'ui',
  bubble: 'ui',
  button: 'ui',
  callout: 'ui',
  card: 'ui',
  checkbox: 'ui',
  collapsible: 'ui',
  command: 'ui',
  container: 'layout',
  'context-menu': 'ui',
  dialog: 'ui',
  drawer: 'ui',
  'dropdown-menu': 'ui',
  empty: 'ui',
  'file-upload': 'ui',
  flex: 'layout',
  frame: 'ui',
  grid: 'layout',
  'icon-tile': 'ui',
  input: 'ui',
  kbd: 'ui',
  label: 'ui',
  message: 'ui',
  'navigation-menu': 'ui',
  pagination: 'ui',
  popover: 'ui',
  progress: 'ui',
  radio: 'ui',
  select: 'ui',
  separator: 'ui',
  skeleton: 'ui',
  snippet: 'ui',
  spinner: 'ui',
  sprite: 'ui',
  stack: 'layout',
  steps: 'ui',
  switch: 'ui',
  table: 'ui',
  tabs: 'ui',
  timeline: 'ui',
  toast: 'ui',
  tooltip: 'ui',
  tree: 'ui',
  typography: 'ui',
} as const;

export const DEMO_REGISTRY = {
  accordion: {
    collapsed: 'packages/ui/src/demos/accordion/collapsed.tsx',
    default: 'packages/ui/src/demos/accordion/default.tsx',
    multiple: 'packages/ui/src/demos/accordion/multiple.tsx',
  },
  avatar: {
    'avatar-group': 'packages/ui/src/demos/avatar/avatar-group.tsx',
    default: 'packages/ui/src/demos/avatar/default.tsx',
    sizes: 'packages/ui/src/demos/avatar/sizes.tsx',
    'with-fallback': 'packages/ui/src/demos/avatar/with-fallback.tsx',
  },
  badge: {
    default: 'packages/ui/src/demos/badge/default.tsx',
    destructive: 'packages/ui/src/demos/badge/destructive.tsx',
    outline: 'packages/ui/src/demos/badge/outline.tsx',
    secondary: 'packages/ui/src/demos/badge/secondary.tsx',
    'with-icon': 'packages/ui/src/demos/badge/with-icon.tsx',
  },
  banner: {
    danger: 'packages/ui/src/demos/banner/danger.tsx',
    default: 'packages/ui/src/demos/banner/default.tsx',
    dismissible: 'packages/ui/src/demos/banner/dismissible.tsx',
    info: 'packages/ui/src/demos/banner/info.tsx',
    success: 'packages/ui/src/demos/banner/success.tsx',
    variants: 'packages/ui/src/demos/banner/variants.tsx',
    warning: 'packages/ui/src/demos/banner/warning.tsx',
  },
  breadcrumb: {
    collapsed: 'packages/ui/src/demos/breadcrumb/collapsed.tsx',
    'custom-separator': 'packages/ui/src/demos/breadcrumb/custom-separator.tsx',
    default: 'packages/ui/src/demos/breadcrumb/default.tsx',
  },
  bubble: {
    default: 'packages/ui/src/demos/bubble/default.tsx',
    variants: 'packages/ui/src/demos/bubble/variants.tsx',
  },
  button: {
    default: 'packages/ui/src/demos/button/default.tsx',
    destructive: 'packages/ui/src/demos/button/destructive.tsx',
    ghost: 'packages/ui/src/demos/button/ghost.tsx',
    link: 'packages/ui/src/demos/button/link.tsx',
    outline: 'packages/ui/src/demos/button/outline.tsx',
    secondary: 'packages/ui/src/demos/button/secondary.tsx',
    sizes: 'packages/ui/src/demos/button/sizes.tsx',
    variants: 'packages/ui/src/demos/button/variants.tsx',
  },
  callout: {
    danger: 'packages/ui/src/demos/callout/danger.tsx',
    default: 'packages/ui/src/demos/callout/default.tsx',
    info: 'packages/ui/src/demos/callout/info.tsx',
    success: 'packages/ui/src/demos/callout/success.tsx',
    variants: 'packages/ui/src/demos/callout/variants.tsx',
    warning: 'packages/ui/src/demos/callout/warning.tsx',
  },
  card: {
    compact: 'packages/ui/src/demos/card/compact.tsx',
    default: 'packages/ui/src/demos/card/default.tsx',
    ghost: 'packages/ui/src/demos/card/ghost.tsx',
    outline: 'packages/ui/src/demos/card/outline.tsx',
  },
  checkbox: {
    default: 'packages/ui/src/demos/checkbox/default.tsx',
    disabled: 'packages/ui/src/demos/checkbox/disabled.tsx',
    'with-label': 'packages/ui/src/demos/checkbox/with-label.tsx',
  },
  collapsible: {
    bordered: 'packages/ui/src/demos/collapsible/bordered.tsx',
    card: 'packages/ui/src/demos/collapsible/card.tsx',
    default: 'packages/ui/src/demos/collapsible/default.tsx',
  },
  command: {
    default: 'packages/ui/src/demos/command/default.tsx',
  },
  container: {
    default: 'packages/ui/src/demos/container/default.tsx',
  },
  'context-menu': {
    default: 'packages/ui/src/demos/context-menu/default.tsx',
  },
  dialog: {
    alert: 'packages/ui/src/demos/dialog/alert.tsx',
    default: 'packages/ui/src/demos/dialog/default.tsx',
  },
  drawer: {
    default: 'packages/ui/src/demos/drawer/default.tsx',
    form: 'packages/ui/src/demos/drawer/form.tsx',
    positions: 'packages/ui/src/demos/drawer/positions.tsx',
  },
  'dropdown-menu': {
    checkboxes: 'packages/ui/src/demos/dropdown-menu/checkboxes.tsx',
    default: 'packages/ui/src/demos/dropdown-menu/default.tsx',
    'radio-group': 'packages/ui/src/demos/dropdown-menu/radio-group.tsx',
  },
  empty: {
    default: 'packages/ui/src/demos/empty/default.tsx',
    outline: 'packages/ui/src/demos/empty/outline.tsx',
  },
  'file-upload': {
    avatar: 'packages/ui/src/demos/file-upload/avatar.tsx',
    compact: 'packages/ui/src/demos/file-upload/compact.tsx',
    default: 'packages/ui/src/demos/file-upload/default.tsx',
    images: 'packages/ui/src/demos/file-upload/images.tsx',
    multiple: 'packages/ui/src/demos/file-upload/multiple.tsx',
    'upload-progress': 'packages/ui/src/demos/file-upload/upload-progress.tsx',
  },
  flex: {
    default: 'packages/ui/src/demos/flex/default.tsx',
  },
  frame: {
    default: 'packages/ui/src/demos/frame/default.tsx',
    stacked: 'packages/ui/src/demos/frame/stacked.tsx',
  },
  grid: {
    default: 'packages/ui/src/demos/grid/default.tsx',
  },
  'icon-tile': {
    default: 'packages/ui/src/demos/icon-tile/default.tsx',
    radius: 'packages/ui/src/demos/icon-tile/radius.tsx',
    sizes: 'packages/ui/src/demos/icon-tile/sizes.tsx',
    text: 'packages/ui/src/demos/icon-tile/text.tsx',
    tones: 'packages/ui/src/demos/icon-tile/tones.tsx',
    variants: 'packages/ui/src/demos/icon-tile/variants.tsx',
  },
  input: {
    default: 'packages/ui/src/demos/input/default.tsx',
    disabled: 'packages/ui/src/demos/input/disabled.tsx',
    sizes: 'packages/ui/src/demos/input/sizes.tsx',
    'with-error': 'packages/ui/src/demos/input/with-error.tsx',
    'with-icon': 'packages/ui/src/demos/input/with-icon.tsx',
    'with-label': 'packages/ui/src/demos/input/with-label.tsx',
  },
  kbd: {
    default: 'packages/ui/src/demos/kbd/default.tsx',
    sizes: 'packages/ui/src/demos/kbd/sizes.tsx',
    variants: 'packages/ui/src/demos/kbd/variants.tsx',
    'with-group': 'packages/ui/src/demos/kbd/with-group.tsx',
  },
  label: {
    default: 'packages/ui/src/demos/label/default.tsx',
    required: 'packages/ui/src/demos/label/required.tsx',
  },
  message: {
    default: 'packages/ui/src/demos/message/default.tsx',
    grouped: 'packages/ui/src/demos/message/grouped.tsx',
  },
  'navigation-menu': {
    badges: 'packages/ui/src/demos/navigation-menu/badges.tsx',
    default: 'packages/ui/src/demos/navigation-menu/default.tsx',
  },
  pagination: {
    compact: 'packages/ui/src/demos/pagination/compact.tsx',
    default: 'packages/ui/src/demos/pagination/default.tsx',
  },
  popover: {
    default: 'packages/ui/src/demos/popover/default.tsx',
  },
  progress: {
    default: 'packages/ui/src/demos/progress/default.tsx',
    indeterminate: 'packages/ui/src/demos/progress/indeterminate.tsx',
    'with-value': 'packages/ui/src/demos/progress/with-value.tsx',
  },
  radio: {
    default: 'packages/ui/src/demos/radio/default.tsx',
    disabled: 'packages/ui/src/demos/radio/disabled.tsx',
    'with-label': 'packages/ui/src/demos/radio/with-label.tsx',
  },
  select: {
    default: 'packages/ui/src/demos/select/default.tsx',
    'grouped-items': 'packages/ui/src/demos/select/grouped-items.tsx',
  },
  separator: {
    default: 'packages/ui/src/demos/separator/default.tsx',
    'with-label': 'packages/ui/src/demos/separator/with-label.tsx',
  },
  skeleton: {
    card: 'packages/ui/src/demos/skeleton/card.tsx',
    default: 'packages/ui/src/demos/skeleton/default.tsx',
  },
  spinner: {
    default: 'packages/ui/src/demos/spinner/default.tsx',
    sizes: 'packages/ui/src/demos/spinner/sizes.tsx',
    variants: 'packages/ui/src/demos/spinner/variants.tsx',
  },
  sprite: {
    default: 'packages/ui/src/demos/sprite/default.tsx',
    parts: 'packages/ui/src/demos/sprite/parts.tsx',
    seeds: 'packages/ui/src/demos/sprite/seeds.tsx',
    states: 'packages/ui/src/demos/sprite/states.tsx',
  },
  stack: {
    default: 'packages/ui/src/demos/stack/default.tsx',
  },
  switch: {
    default: 'packages/ui/src/demos/switch/default.tsx',
    disabled: 'packages/ui/src/demos/switch/disabled.tsx',
    'with-label': 'packages/ui/src/demos/switch/with-label.tsx',
  },
  table: {
    compact: 'packages/ui/src/demos/table/compact.tsx',
    default: 'packages/ui/src/demos/table/default.tsx',
    striped: 'packages/ui/src/demos/table/striped.tsx',
    'with-actions': 'packages/ui/src/demos/table/with-actions.tsx',
  },
  tabs: {
    default: 'packages/ui/src/demos/tabs/default.tsx',
    vertical: 'packages/ui/src/demos/tabs/vertical.tsx',
  },
  timeline: {
    alternate: 'packages/ui/src/demos/timeline/alternate.tsx',
    default: 'packages/ui/src/demos/timeline/default.tsx',
    horizontal: 'packages/ui/src/demos/timeline/horizontal.tsx',
    icons: 'packages/ui/src/demos/timeline/icons.tsx',
    'left-dates': 'packages/ui/src/demos/timeline/left-dates.tsx',
  },
  toast: {
    default: 'packages/ui/src/demos/toast/default.tsx',
    positions: 'packages/ui/src/demos/toast/positions.tsx',
    variants: 'packages/ui/src/demos/toast/variants.tsx',
    'with-action': 'packages/ui/src/demos/toast/with-action.tsx',
  },
  tooltip: {
    default: 'packages/ui/src/demos/tooltip/default.tsx',
    positions: 'packages/ui/src/demos/tooltip/positions.tsx',
  },
  tree: {
    default: 'packages/ui/src/demos/tree/default.tsx',
    icons: 'packages/ui/src/demos/tree/icons.tsx',
    lines: 'packages/ui/src/demos/tree/lines.tsx',
    'plus-minus': 'packages/ui/src/demos/tree/plus-minus.tsx',
  },
  typography: {
    'custom-tag': 'packages/ui/src/demos/typography/custom-tag.tsx',
    default: 'packages/ui/src/demos/typography/default.tsx',
    headings: 'packages/ui/src/demos/typography/headings.tsx',
    'lead-muted': 'packages/ui/src/demos/typography/lead-muted.tsx',
  },
} as const;

export const BRICK_REGISTRY = {
  dashboard: {
    'dashboard-01': 'packages/ui/src/bricks/dashboard/dashboard-01',
    'dashboard-02': 'packages/ui/src/bricks/dashboard/dashboard-02',
  },
  login: {
    'login-01': 'packages/ui/src/bricks/login/login-01',
    'login-02': 'packages/ui/src/bricks/login/login-02',
    'login-03': 'packages/ui/src/bricks/login/login-03',
  },
  pricing: {
    'pricing-01': 'packages/ui/src/bricks/pricing/pricing-01',
    'pricing-02': 'packages/ui/src/bricks/pricing/pricing-02',
  },
  settings: {
    'settings-01': 'packages/ui/src/bricks/settings/settings-01',
    'settings-02': 'packages/ui/src/bricks/settings/settings-02',
  },
  signup: {
    'signup-01': 'packages/ui/src/bricks/signup/signup-01',
    'signup-02': 'packages/ui/src/bricks/signup/signup-02',
  },
} as const;

export type Family = (typeof FAMILIES)[number]['id'];
export type ComponentName = keyof typeof COMPONENT_REGISTRY;
export type DemoName<T extends keyof typeof DEMO_REGISTRY> = keyof (typeof DEMO_REGISTRY)[T];
export type BrickCategory = keyof typeof BRICK_REGISTRY;
export type BrickName<T extends BrickCategory> = keyof (typeof BRICK_REGISTRY)[T];
