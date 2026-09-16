import type { IconComponentProps } from '@/features/icons/lib/icon-registry';
import { AlignCenterIcon } from '@repo/ui/icons/align-center';
import { BellIcon } from '@repo/ui/icons/bell';
import { BrowserIcon } from '@repo/ui/icons/browser';
import { CardsIcon } from '@repo/ui/icons/cards';
import { CheckSquareIcon } from '@repo/ui/icons/check-square';
import { ChevronsDownUpIcon } from '@repo/ui/icons/chevrons-down-up';
import { ChevronsUpDownIcon } from '@repo/ui/icons/chevrons-up-down';
import { CircleDotIcon } from '@repo/ui/icons/circle-dot';
import { CursorIcon } from '@repo/ui/icons/cursor';
import { DistributeHorizontalIcon } from '@repo/ui/icons/distribute-horizontal';
import { FolderIcon } from '@repo/ui/icons/folder';
import { FrameIcon } from '@repo/ui/icons/frame';
import { GamepadIcon } from '@repo/ui/icons/gamepad';
import { GaugeIcon } from '@repo/ui/icons/gauge';
import { GridIcon } from '@repo/ui/icons/grid';
import { HelpCircleIcon } from '@repo/ui/icons/help-circle';
import { InfoIcon } from '@repo/ui/icons/info';
import { KeyboardIcon } from '@repo/ui/icons/keyboard';
import { LayersIcon } from '@repo/ui/icons/layers';
import { LoaderIcon } from '@repo/ui/icons/loader';
import { MegaphoneIcon } from '@repo/ui/icons/megaphone';
import { MenuIcon } from '@repo/ui/icons/menu';
import { MessageCircleIcon } from '@repo/ui/icons/message-circle';
import { NavigationIcon } from '@repo/ui/icons/navigation';
import { PanelRightIcon } from '@repo/ui/icons/panel-right';
import { RectangleIcon } from '@repo/ui/icons/rectangle';
import { RouteIcon } from '@repo/ui/icons/route';
import { SeparatorHorizontalIcon } from '@repo/ui/icons/separator-horizontal';
import { SquareIcon } from '@repo/ui/icons/square';
import { TableIcon } from '@repo/ui/icons/table';
import { TagIcon } from '@repo/ui/icons/tag';
import { TerminalIcon } from '@repo/ui/icons/terminal';
import { TextCursorInputIcon } from '@repo/ui/icons/text-cursor-input';
import { ToggleIcon } from '@repo/ui/icons/toggle';
import { TypeIcon } from '@repo/ui/icons/type';
import { UserCircleIcon } from '@repo/ui/icons/user-circle';

/**
 * Maps a docs slug (the last segment of its href) to the icon shown in the
 * components grid. Anything without an entry falls back to FALLBACK_ICON.
 */
type IconComponent = React.ComponentType<IconComponentProps>;

const COMPONENT_ICONS: Record<string, IconComponent> = {
  accordion: ChevronsUpDownIcon,
  avatar: UserCircleIcon,
  badge: TagIcon,
  banner: MegaphoneIcon,
  breadcrumb: RouteIcon,
  button: CursorIcon,
  callout: InfoIcon,
  card: CardsIcon,
  checkbox: CheckSquareIcon,
  collapsible: ChevronsDownUpIcon,
  command: TerminalIcon,
  dialog: AlignCenterIcon,
  drawer: PanelRightIcon,
  'dropdown-menu': MenuIcon,
  files: FolderIcon,
  input: TextCursorInputIcon,
  kbd: KeyboardIcon,
  label: TagIcon,
  'navigation-menu': NavigationIcon,
  popover: MessageCircleIcon,
  progress: GaugeIcon,
  radio: CircleDotIcon,
  select: ChevronsUpDownIcon,
  separator: SeparatorHorizontalIcon,
  skeleton: RectangleIcon,
  spinner: LoaderIcon,
  sprite: GamepadIcon,
  switch: ToggleIcon,
  table: TableIcon,
  tabs: BrowserIcon,
  toast: BellIcon,
  tooltip: HelpCircleIcon,
  typography: TypeIcon,

  // Layout primitives
  flex: DistributeHorizontalIcon,
  stack: LayersIcon,
  grid: GridIcon,
  container: FrameIcon,
};

export const FALLBACK_ICON = SquareIcon;

export function getComponentIcon(href: string): IconComponent {
  const slug = href.split('/').pop() || '';
  return COMPONENT_ICONS[slug] ?? FALLBACK_ICON;
}

export function ComponentIcon({ href, ...props }: IconComponentProps & { href: string }) {
  const Icon = getComponentIcon(href);
  return <Icon {...props} />;
}
