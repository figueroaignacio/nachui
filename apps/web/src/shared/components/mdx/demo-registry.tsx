// GENERATED FILE, DO NOT EDIT.
// Run `pnpm --filter @repo/ui generate:registry` after adding a component,
// a demo, a brick or an icon. The build fails if this file is out of date.

export type DemoLoader = () => Promise<React.ComponentType>;

export const DEMO_COMPONENTS: Record<string, Record<string, DemoLoader>> = {
  accordion: {
    collapsed: () => import('@repo/ui/src/demos/accordion/collapsed').then((m) => m.Collapsed),
    default: () => import('@repo/ui/src/demos/accordion/default').then((m) => m.Default),
    multiple: () => import('@repo/ui/src/demos/accordion/multiple').then((m) => m.Multiple),
  },
  actions: {
    default: () => import('@repo/ui/src/demos/actions/default').then((m) => m.Default),
    'with-message': () => import('@repo/ui/src/demos/actions/with-message').then((m) => m.WithMessage),
  },
  'agent-run': {
    default: () => import('@repo/ui/src/demos/agent-run/default').then((m) => m.Default),
    live: () => import('@repo/ui/src/demos/agent-run/live').then((m) => m.Live),
  },
  'aspect-ratio': {
    default: () => import('@repo/ui/src/demos/aspect-ratio/default').then((m) => m.Default),
    ratios: () => import('@repo/ui/src/demos/aspect-ratio/ratios').then((m) => m.Ratios),
  },
  attachment: {
    cards: () => import('@repo/ui/src/demos/attachment/cards').then((m) => m.Cards),
    chips: () => import('@repo/ui/src/demos/attachment/chips').then((m) => m.Chips),
    default: () => import('@repo/ui/src/demos/attachment/default').then((m) => m.Default),
    uploading: () => import('@repo/ui/src/demos/attachment/uploading').then((m) => m.Uploading),
  },
  attachments: {
    default: () => import('@repo/ui/src/demos/attachments/default').then((m) => m.Default),
    variants: () => import('@repo/ui/src/demos/attachments/variants').then((m) => m.Variants),
  },
  avatar: {
    'avatar-group': () => import('@repo/ui/src/demos/avatar/avatar-group').then((m) => m.AvatarGroup),
    default: () => import('@repo/ui/src/demos/avatar/default').then((m) => m.Default),
    sizes: () => import('@repo/ui/src/demos/avatar/sizes').then((m) => m.Sizes),
    'with-fallback': () => import('@repo/ui/src/demos/avatar/with-fallback').then((m) => m.WithFallback),
  },
  badge: {
    default: () => import('@repo/ui/src/demos/badge/default').then((m) => m.Default),
    destructive: () => import('@repo/ui/src/demos/badge/destructive').then((m) => m.Destructive),
    outline: () => import('@repo/ui/src/demos/badge/outline').then((m) => m.Outline),
    secondary: () => import('@repo/ui/src/demos/badge/secondary').then((m) => m.Secondary),
    'with-icon': () => import('@repo/ui/src/demos/badge/with-icon').then((m) => m.WithIcon),
  },
  banner: {
    danger: () => import('@repo/ui/src/demos/banner/danger').then((m) => m.Danger),
    default: () => import('@repo/ui/src/demos/banner/default').then((m) => m.Default),
    dismissible: () => import('@repo/ui/src/demos/banner/dismissible').then((m) => m.Dismissible),
    info: () => import('@repo/ui/src/demos/banner/info').then((m) => m.Info),
    success: () => import('@repo/ui/src/demos/banner/success').then((m) => m.Success),
    variants: () => import('@repo/ui/src/demos/banner/variants').then((m) => m.Variants),
    warning: () => import('@repo/ui/src/demos/banner/warning').then((m) => m.Warning),
  },
  breadcrumb: {
    collapsed: () => import('@repo/ui/src/demos/breadcrumb/collapsed').then((m) => m.Collapsed),
    'custom-separator': () => import('@repo/ui/src/demos/breadcrumb/custom-separator').then((m) => m.CustomSeparator),
    default: () => import('@repo/ui/src/demos/breadcrumb/default').then((m) => m.Default),
  },
  bubble: {
    default: () => import('@repo/ui/src/demos/bubble/default').then((m) => m.Default),
    variants: () => import('@repo/ui/src/demos/bubble/variants').then((m) => m.Variants),
  },
  button: {
    default: () => import('@repo/ui/src/demos/button/default').then((m) => m.Default),
    destructive: () => import('@repo/ui/src/demos/button/destructive').then((m) => m.Destructive),
    ghost: () => import('@repo/ui/src/demos/button/ghost').then((m) => m.Ghost),
    link: () => import('@repo/ui/src/demos/button/link').then((m) => m.Link),
    outline: () => import('@repo/ui/src/demos/button/outline').then((m) => m.Outline),
    secondary: () => import('@repo/ui/src/demos/button/secondary').then((m) => m.Secondary),
    sizes: () => import('@repo/ui/src/demos/button/sizes').then((m) => m.Sizes),
    variants: () => import('@repo/ui/src/demos/button/variants').then((m) => m.Variants),
  },
  callout: {
    danger: () => import('@repo/ui/src/demos/callout/danger').then((m) => m.Danger),
    default: () => import('@repo/ui/src/demos/callout/default').then((m) => m.Default),
    info: () => import('@repo/ui/src/demos/callout/info').then((m) => m.Info),
    success: () => import('@repo/ui/src/demos/callout/success').then((m) => m.Success),
    variants: () => import('@repo/ui/src/demos/callout/variants').then((m) => m.Variants),
    warning: () => import('@repo/ui/src/demos/callout/warning').then((m) => m.Warning),
  },
  card: {
    compact: () => import('@repo/ui/src/demos/card/compact').then((m) => m.Compact),
    default: () => import('@repo/ui/src/demos/card/default').then((m) => m.Default),
    ghost: () => import('@repo/ui/src/demos/card/ghost').then((m) => m.Ghost),
    outline: () => import('@repo/ui/src/demos/card/outline').then((m) => m.Outline),
  },
  center: {
    axis: () => import('@repo/ui/src/demos/center/axis').then((m) => m.Axis),
    default: () => import('@repo/ui/src/demos/center/default').then((m) => m.Default),
  },
  'chain-of-thought': {
    default: () => import('@repo/ui/src/demos/chain-of-thought/default').then((m) => m.Default),
  },
  chat: {
    default: () => import('@repo/ui/src/demos/chat/default').then((m) => m.Default),
    streaming: () => import('@repo/ui/src/demos/chat/streaming').then((m) => m.Streaming),
  },
  checkbox: {
    default: () => import('@repo/ui/src/demos/checkbox/default').then((m) => m.Default),
    disabled: () => import('@repo/ui/src/demos/checkbox/disabled').then((m) => m.Disabled),
    'with-label': () => import('@repo/ui/src/demos/checkbox/with-label').then((m) => m.WithLabel),
  },
  'code-block': {
    collapsible: () => import('@repo/ui/src/demos/code-block/collapsible').then((m) => m.Collapsible),
    default: () => import('@repo/ui/src/demos/code-block/default').then((m) => m.Default),
  },
  collapsible: {
    bordered: () => import('@repo/ui/src/demos/collapsible/bordered').then((m) => m.Bordered),
    card: () => import('@repo/ui/src/demos/collapsible/card').then((m) => m.Card),
    default: () => import('@repo/ui/src/demos/collapsible/default').then((m) => m.Default),
  },
  command: {
    default: () => import('@repo/ui/src/demos/command/default').then((m) => m.Default),
  },
  composer: {
    default: () => import('@repo/ui/src/demos/composer/default').then((m) => m.Default),
    streaming: () => import('@repo/ui/src/demos/composer/streaming').then((m) => m.Streaming),
  },
  confirm: {
    default: () => import('@repo/ui/src/demos/confirm/default').then((m) => m.Default),
    hook: () => import('@repo/ui/src/demos/confirm/hook').then((m) => m.Hook),
    'with-text': () => import('@repo/ui/src/demos/confirm/with-text').then((m) => m.WithText),
  },
  container: {
    default: () => import('@repo/ui/src/demos/container/default').then((m) => m.Default),
  },
  context: {
    default: () => import('@repo/ui/src/demos/context/default').then((m) => m.Default),
  },
  'context-menu': {
    default: () => import('@repo/ui/src/demos/context-menu/default').then((m) => m.Default),
  },
  conversation: {
    default: () => import('@repo/ui/src/demos/conversation/default').then((m) => m.Default),
    streaming: () => import('@repo/ui/src/demos/conversation/streaming').then((m) => m.Streaming),
  },
  'data-table': {
    compact: () => import('@repo/ui/src/demos/data-table/compact').then((m) => m.Compact),
    default: () => import('@repo/ui/src/demos/data-table/default').then((m) => m.Default),
  },
  dialog: {
    alert: () => import('@repo/ui/src/demos/dialog/alert').then((m) => m.Alert),
    default: () => import('@repo/ui/src/demos/dialog/default').then((m) => m.Default),
  },
  dock: {
    default: () => import('@repo/ui/src/demos/dock/default').then((m) => m.Default),
    links: () => import('@repo/ui/src/demos/dock/links').then((m) => m.Links),
  },
  drawer: {
    default: () => import('@repo/ui/src/demos/drawer/default').then((m) => m.Default),
    form: () => import('@repo/ui/src/demos/drawer/form').then((m) => m.Form),
    positions: () => import('@repo/ui/src/demos/drawer/positions').then((m) => m.Positions),
  },
  'dropdown-menu': {
    checkboxes: () => import('@repo/ui/src/demos/dropdown-menu/checkboxes').then((m) => m.Checkboxes),
    default: () => import('@repo/ui/src/demos/dropdown-menu/default').then((m) => m.Default),
    'radio-group': () => import('@repo/ui/src/demos/dropdown-menu/radio-group').then((m) => m.RadioGroup),
  },
  empty: {
    default: () => import('@repo/ui/src/demos/empty/default').then((m) => m.Default),
    outline: () => import('@repo/ui/src/demos/empty/outline').then((m) => m.Outline),
  },
  field: {
    default: () => import('@repo/ui/src/demos/field/default').then((m) => m.Default),
    fieldset: () => import('@repo/ui/src/demos/field/fieldset').then((m) => m.Fieldset),
    horizontal: () => import('@repo/ui/src/demos/field/horizontal').then((m) => m.Horizontal),
    'with-error': () => import('@repo/ui/src/demos/field/with-error').then((m) => m.WithError),
  },
  'file-upload': {
    avatar: () => import('@repo/ui/src/demos/file-upload/avatar').then((m) => m.Avatar),
    compact: () => import('@repo/ui/src/demos/file-upload/compact').then((m) => m.Compact),
    default: () => import('@repo/ui/src/demos/file-upload/default').then((m) => m.Default),
    images: () => import('@repo/ui/src/demos/file-upload/images').then((m) => m.Images),
    multiple: () => import('@repo/ui/src/demos/file-upload/multiple').then((m) => m.Multiple),
    'upload-progress': () => import('@repo/ui/src/demos/file-upload/upload-progress').then((m) => m.UploadProgress),
  },
  flex: {
    default: () => import('@repo/ui/src/demos/flex/default').then((m) => m.Default),
  },
  frame: {
    default: () => import('@repo/ui/src/demos/frame/default').then((m) => m.Default),
    stacked: () => import('@repo/ui/src/demos/frame/stacked').then((m) => m.Stacked),
  },
  grid: {
    default: () => import('@repo/ui/src/demos/grid/default').then((m) => m.Default),
  },
  'hover-card': {
    default: () => import('@repo/ui/src/demos/hover-card/default').then((m) => m.Default),
    'link-preview': () => import('@repo/ui/src/demos/hover-card/link-preview').then((m) => m.LinkPreview),
  },
  'icon-tile': {
    default: () => import('@repo/ui/src/demos/icon-tile/default').then((m) => m.Default),
    radius: () => import('@repo/ui/src/demos/icon-tile/radius').then((m) => m.Radius),
    sizes: () => import('@repo/ui/src/demos/icon-tile/sizes').then((m) => m.Sizes),
    text: () => import('@repo/ui/src/demos/icon-tile/text').then((m) => m.Text),
    tones: () => import('@repo/ui/src/demos/icon-tile/tones').then((m) => m.Tones),
    variants: () => import('@repo/ui/src/demos/icon-tile/variants').then((m) => m.Variants),
  },
  input: {
    default: () => import('@repo/ui/src/demos/input/default').then((m) => m.Default),
    disabled: () => import('@repo/ui/src/demos/input/disabled').then((m) => m.Disabled),
    sizes: () => import('@repo/ui/src/demos/input/sizes').then((m) => m.Sizes),
    'with-error': () => import('@repo/ui/src/demos/input/with-error').then((m) => m.WithError),
    'with-icon': () => import('@repo/ui/src/demos/input/with-icon').then((m) => m.WithIcon),
    'with-label': () => import('@repo/ui/src/demos/input/with-label').then((m) => m.WithLabel),
  },
  kbd: {
    default: () => import('@repo/ui/src/demos/kbd/default').then((m) => m.Default),
    sizes: () => import('@repo/ui/src/demos/kbd/sizes').then((m) => m.Sizes),
    variants: () => import('@repo/ui/src/demos/kbd/variants').then((m) => m.Variants),
    'with-group': () => import('@repo/ui/src/demos/kbd/with-group').then((m) => m.WithGroup),
  },
  label: {
    default: () => import('@repo/ui/src/demos/label/default').then((m) => m.Default),
    required: () => import('@repo/ui/src/demos/label/required').then((m) => m.Required),
  },
  message: {
    default: () => import('@repo/ui/src/demos/message/default').then((m) => m.Default),
    grouped: () => import('@repo/ui/src/demos/message/grouped').then((m) => m.Grouped),
  },
  'navigation-menu': {
    badges: () => import('@repo/ui/src/demos/navigation-menu/badges').then((m) => m.Badges),
    default: () => import('@repo/ui/src/demos/navigation-menu/default').then((m) => m.Default),
  },
  pagination: {
    compact: () => import('@repo/ui/src/demos/pagination/compact').then((m) => m.Compact),
    default: () => import('@repo/ui/src/demos/pagination/default').then((m) => m.Default),
  },
  popover: {
    default: () => import('@repo/ui/src/demos/popover/default').then((m) => m.Default),
  },
  progress: {
    default: () => import('@repo/ui/src/demos/progress/default').then((m) => m.Default),
    indeterminate: () => import('@repo/ui/src/demos/progress/indeterminate').then((m) => m.Indeterminate),
    'with-value': () => import('@repo/ui/src/demos/progress/with-value').then((m) => m.WithValue),
  },
  'prompt-input': {
    attachments: () => import('@repo/ui/src/demos/prompt-input/attachments').then((m) => m.Attachments),
    default: () => import('@repo/ui/src/demos/prompt-input/default').then((m) => m.Default),
    statuses: () => import('@repo/ui/src/demos/prompt-input/statuses').then((m) => m.Statuses),
  },
  radio: {
    default: () => import('@repo/ui/src/demos/radio/default').then((m) => m.Default),
    disabled: () => import('@repo/ui/src/demos/radio/disabled').then((m) => m.Disabled),
    'with-label': () => import('@repo/ui/src/demos/radio/with-label').then((m) => m.WithLabel),
  },
  rating: {
    'custom-icon': () => import('@repo/ui/src/demos/rating/custom-icon').then((m) => m.CustomIcon),
    default: () => import('@repo/ui/src/demos/rating/default').then((m) => m.Default),
    half: () => import('@repo/ui/src/demos/rating/half').then((m) => m.Half),
    'read-only': () => import('@repo/ui/src/demos/rating/read-only').then((m) => m.ReadOnly),
    sizes: () => import('@repo/ui/src/demos/rating/sizes').then((m) => m.Sizes),
  },
  reasoning: {
    default: () => import('@repo/ui/src/demos/reasoning/default').then((m) => m.Default),
    streaming: () => import('@repo/ui/src/demos/reasoning/streaming').then((m) => m.Streaming),
  },
  resizable: {
    default: () => import('@repo/ui/src/demos/resizable/default').then((m) => m.Default),
    nested: () => import('@repo/ui/src/demos/resizable/nested').then((m) => m.Nested),
    vertical: () => import('@repo/ui/src/demos/resizable/vertical').then((m) => m.Vertical),
  },
  response: {
    default: () => import('@repo/ui/src/demos/response/default').then((m) => m.Default),
    streaming: () => import('@repo/ui/src/demos/response/streaming').then((m) => m.Streaming),
  },
  'scroll-area': {
    both: () => import('@repo/ui/src/demos/scroll-area/both').then((m) => m.Both),
    default: () => import('@repo/ui/src/demos/scroll-area/default').then((m) => m.Default),
    horizontal: () => import('@repo/ui/src/demos/scroll-area/horizontal').then((m) => m.Horizontal),
  },
  'search-command': {
    controlled: () => import('@repo/ui/src/demos/search-command/controlled').then((m) => m.Controlled),
    default: () => import('@repo/ui/src/demos/search-command/default').then((m) => m.Default),
  },
  section: {
    backgrounds: () => import('@repo/ui/src/demos/section/backgrounds').then((m) => m.Backgrounds),
    centered: () => import('@repo/ui/src/demos/section/centered').then((m) => m.Centered),
    default: () => import('@repo/ui/src/demos/section/default').then((m) => m.Default),
  },
  select: {
    default: () => import('@repo/ui/src/demos/select/default').then((m) => m.Default),
    'grouped-items': () => import('@repo/ui/src/demos/select/grouped-items').then((m) => m.GroupedItems),
  },
  separator: {
    default: () => import('@repo/ui/src/demos/separator/default').then((m) => m.Default),
    'with-label': () => import('@repo/ui/src/demos/separator/with-label').then((m) => m.WithLabel),
  },
  'settings-row': {
    danger: () => import('@repo/ui/src/demos/settings-row/danger').then((m) => m.Danger),
    default: () => import('@repo/ui/src/demos/settings-row/default').then((m) => m.Default),
  },
  sheet: {
    default: () => import('@repo/ui/src/demos/sheet/default').then((m) => m.Default),
    sides: () => import('@repo/ui/src/demos/sheet/sides').then((m) => m.Sides),
    sizes: () => import('@repo/ui/src/demos/sheet/sizes').then((m) => m.Sizes),
  },
  shimmer: {
    default: () => import('@repo/ui/src/demos/shimmer/default').then((m) => m.Default),
    sizes: () => import('@repo/ui/src/demos/shimmer/sizes').then((m) => m.Sizes),
  },
  skeleton: {
    card: () => import('@repo/ui/src/demos/skeleton/card').then((m) => m.Card),
    default: () => import('@repo/ui/src/demos/skeleton/default').then((m) => m.Default),
  },
  sources: {
    default: () => import('@repo/ui/src/demos/sources/default').then((m) => m.Default),
    open: () => import('@repo/ui/src/demos/sources/open').then((m) => m.Open),
  },
  spacer: {
    default: () => import('@repo/ui/src/demos/spacer/default').then((m) => m.Default),
    fixed: () => import('@repo/ui/src/demos/spacer/fixed').then((m) => m.Fixed),
  },
  spinner: {
    default: () => import('@repo/ui/src/demos/spinner/default').then((m) => m.Default),
    sizes: () => import('@repo/ui/src/demos/spinner/sizes').then((m) => m.Sizes),
    variants: () => import('@repo/ui/src/demos/spinner/variants').then((m) => m.Variants),
  },
  split: {
    default: () => import('@repo/ui/src/demos/split/default').then((m) => m.Default),
    ratios: () => import('@repo/ui/src/demos/split/ratios').then((m) => m.Ratios),
    reverse: () => import('@repo/ui/src/demos/split/reverse').then((m) => m.Reverse),
  },
  sprite: {
    default: () => import('@repo/ui/src/demos/sprite/default').then((m) => m.Default),
    parts: () => import('@repo/ui/src/demos/sprite/parts').then((m) => m.Parts),
    seeds: () => import('@repo/ui/src/demos/sprite/seeds').then((m) => m.Seeds),
    states: () => import('@repo/ui/src/demos/sprite/states').then((m) => m.States),
  },
  stack: {
    default: () => import('@repo/ui/src/demos/stack/default').then((m) => m.Default),
  },
  suggestion: {
    default: () => import('@repo/ui/src/demos/suggestion/default').then((m) => m.Default),
    variants: () => import('@repo/ui/src/demos/suggestion/variants').then((m) => m.Variants),
  },
  switch: {
    default: () => import('@repo/ui/src/demos/switch/default').then((m) => m.Default),
    disabled: () => import('@repo/ui/src/demos/switch/disabled').then((m) => m.Disabled),
    'with-label': () => import('@repo/ui/src/demos/switch/with-label').then((m) => m.WithLabel),
  },
  table: {
    compact: () => import('@repo/ui/src/demos/table/compact').then((m) => m.Compact),
    default: () => import('@repo/ui/src/demos/table/default').then((m) => m.Default),
    striped: () => import('@repo/ui/src/demos/table/striped').then((m) => m.Striped),
    'with-actions': () => import('@repo/ui/src/demos/table/with-actions').then((m) => m.WithActions),
  },
  tabs: {
    default: () => import('@repo/ui/src/demos/tabs/default').then((m) => m.Default),
    vertical: () => import('@repo/ui/src/demos/tabs/vertical').then((m) => m.Vertical),
  },
  task: {
    default: () => import('@repo/ui/src/demos/task/default').then((m) => m.Default),
    statuses: () => import('@repo/ui/src/demos/task/statuses').then((m) => m.Statuses),
  },
  textarea: {
    'auto-resize': () => import('@repo/ui/src/demos/textarea/auto-resize').then((m) => m.AutoResize),
    default: () => import('@repo/ui/src/demos/textarea/default').then((m) => m.Default),
    'with-count': () => import('@repo/ui/src/demos/textarea/with-count').then((m) => m.WithCount),
    'with-error': () => import('@repo/ui/src/demos/textarea/with-error').then((m) => m.WithError),
    'with-label': () => import('@repo/ui/src/demos/textarea/with-label').then((m) => m.WithLabel),
  },
  timeline: {
    alternate: () => import('@repo/ui/src/demos/timeline/alternate').then((m) => m.Alternate),
    default: () => import('@repo/ui/src/demos/timeline/default').then((m) => m.Default),
    horizontal: () => import('@repo/ui/src/demos/timeline/horizontal').then((m) => m.Horizontal),
    icons: () => import('@repo/ui/src/demos/timeline/icons').then((m) => m.Icons),
    'left-dates': () => import('@repo/ui/src/demos/timeline/left-dates').then((m) => m.LeftDates),
  },
  toast: {
    default: () => import('@repo/ui/src/demos/toast/default').then((m) => m.Default),
    positions: () => import('@repo/ui/src/demos/toast/positions').then((m) => m.Positions),
    variants: () => import('@repo/ui/src/demos/toast/variants').then((m) => m.Variants),
    'with-action': () => import('@repo/ui/src/demos/toast/with-action').then((m) => m.WithAction),
  },
  tool: {
    default: () => import('@repo/ui/src/demos/tool/default').then((m) => m.Default),
    statuses: () => import('@repo/ui/src/demos/tool/statuses').then((m) => m.Statuses),
  },
  tooltip: {
    default: () => import('@repo/ui/src/demos/tooltip/default').then((m) => m.Default),
    positions: () => import('@repo/ui/src/demos/tooltip/positions').then((m) => m.Positions),
  },
  tree: {
    default: () => import('@repo/ui/src/demos/tree/default').then((m) => m.Default),
    icons: () => import('@repo/ui/src/demos/tree/icons').then((m) => m.Icons),
    lines: () => import('@repo/ui/src/demos/tree/lines').then((m) => m.Lines),
    'plus-minus': () => import('@repo/ui/src/demos/tree/plus-minus').then((m) => m.PlusMinus),
  },
  typography: {
    'custom-tag': () => import('@repo/ui/src/demos/typography/custom-tag').then((m) => m.CustomTag),
    default: () => import('@repo/ui/src/demos/typography/default').then((m) => m.Default),
    headings: () => import('@repo/ui/src/demos/typography/headings').then((m) => m.Headings),
    'lead-muted': () => import('@repo/ui/src/demos/typography/lead-muted').then((m) => m.LeadMuted),
  },
};
