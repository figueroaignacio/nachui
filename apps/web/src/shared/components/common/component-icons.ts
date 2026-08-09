import {
  AlignBoxMiddleCenterIcon,
  BrowserIcon,
  BubbleChatIcon,
  Cards01Icon,
  CheckmarkSquare01Icon,
  CollapseIcon,
  Cursor01Icon,
  DistributeHorizontalCenterIcon,
  Folder01Icon,
  FrameIcon,
  GridIcon,
  HelpCircleIcon,
  InformationCircleIcon,
  InputTextIcon,
  KeyboardIcon,
  LabelIcon,
  Layers01Icon,
  Loading03Icon,
  Megaphone01Icon,
  Menu01Icon,
  Notification01Icon,
  Progress01Icon,
  RadioButtonIcon,
  Rectangular01Icon,
  Route01Icon,
  Select01Icon,
  SeparatorHorizontalIcon,
  SidebarRightIcon,
  Square01Icon,
  Table01Icon,
  Tag01Icon,
  TerminalIcon,
  TextFontIcon,
  ToggleOnIcon,
  UnfoldMoreIcon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';

/**
 * Maps a docs slug (the last segment of its href) to the icon shown in the
 * components grid. Anything without an entry falls back to FALLBACK_ICON.
 */
const COMPONENT_ICONS: Record<string, IconSvgElement> = {
  accordion: UnfoldMoreIcon,
  avatar: UserCircleIcon,
  badge: Tag01Icon,
  banner: Megaphone01Icon,
  breadcrumb: Route01Icon,
  button: Cursor01Icon,
  callout: InformationCircleIcon,
  card: Cards01Icon,
  checkbox: CheckmarkSquare01Icon,
  collapsible: CollapseIcon,
  command: TerminalIcon,
  dialog: AlignBoxMiddleCenterIcon,
  drawer: SidebarRightIcon,
  'dropdown-menu': Menu01Icon,
  files: Folder01Icon,
  input: InputTextIcon,
  kbd: KeyboardIcon,
  label: LabelIcon,
  popover: BubbleChatIcon,
  progress: Progress01Icon,
  radio: RadioButtonIcon,
  select: Select01Icon,
  separator: SeparatorHorizontalIcon,
  skeleton: Rectangular01Icon,
  spinner: Loading03Icon,
  switch: ToggleOnIcon,
  table: Table01Icon,
  tabs: BrowserIcon,
  toast: Notification01Icon,
  tooltip: HelpCircleIcon,
  typography: TextFontIcon,

  // Layout primitives
  flex: DistributeHorizontalCenterIcon,
  stack: Layers01Icon,
  grid: GridIcon,
  container: FrameIcon,
};

export const FALLBACK_ICON = Square01Icon;

export function getComponentIcon(href: string): IconSvgElement {
  const slug = href.split('/').pop() || '';
  return COMPONENT_ICONS[slug] ?? FALLBACK_ICON;
}
