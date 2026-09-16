// GENERATED FILE, DO NOT EDIT.
// Run `pnpm --filter @repo/ui generate:registry` after adding a component,
// a demo, a brick or an icon. The build fails if this file is out of date.

import { Assistant as MessageAssistantExample } from '@repo/ui/src/examples/message/assistant';
import { Attachments as BubbleAttachmentsExample } from '@repo/ui/src/examples/bubble/attachments';
import { Confirm as DialogConfirmExample } from '@repo/ui/src/examples/dialog/confirm';
import { Deployments as TimelineDeploymentsExample } from '@repo/ui/src/examples/timeline/deployments';
import { Documents as FileUploadDocumentsExample } from '@repo/ui/src/examples/file-upload/documents';
import { FeatureList as IconTileFeatureListExample } from '@repo/ui/src/examples/icon-tile/feature-list';
import { Icons as AccordionIconsExample } from '@repo/ui/src/examples/accordion/icons';
import { Inbox as EmptyInboxExample } from '@repo/ui/src/examples/empty/inbox';
import { Nested as FrameNestedExample } from '@repo/ui/src/examples/frame/nested';
import { Preferences as SwitchPreferencesExample } from '@repo/ui/src/examples/switch/preferences';
import { Settings as TabsSettingsExample } from '@repo/ui/src/examples/tabs/settings';
import { SignIn as InputSignInExample } from '@repo/ui/src/examples/input/sign-in';
import { Stats as CardStatsExample } from '@repo/ui/src/examples/card/stats';
import { Statuses as BadgeStatusesExample } from '@repo/ui/src/examples/badge/statuses';
import { Table as PaginationTableExample } from '@repo/ui/src/examples/pagination/table';
import { Team as AvatarTeamExample } from '@repo/ui/src/examples/avatar/team';
import { Toolbar as ButtonToolbarExample } from '@repo/ui/src/examples/button/toolbar';
import { TrackList as ContextMenuTrackListExample } from '@repo/ui/src/examples/context-menu/track-list';

export const EXAMPLE_COMPONENTS: Record<string, Record<string, React.ComponentType>> = {
  accordion: {
    icons: AccordionIconsExample,
  },
  avatar: {
    team: AvatarTeamExample,
  },
  badge: {
    statuses: BadgeStatusesExample,
  },
  bubble: {
    attachments: BubbleAttachmentsExample,
  },
  button: {
    toolbar: ButtonToolbarExample,
  },
  card: {
    stats: CardStatsExample,
  },
  'context-menu': {
    'track-list': ContextMenuTrackListExample,
  },
  dialog: {
    confirm: DialogConfirmExample,
  },
  empty: {
    inbox: EmptyInboxExample,
  },
  'file-upload': {
    documents: FileUploadDocumentsExample,
  },
  frame: {
    nested: FrameNestedExample,
  },
  'icon-tile': {
    'feature-list': IconTileFeatureListExample,
  },
  input: {
    'sign-in': InputSignInExample,
  },
  message: {
    assistant: MessageAssistantExample,
  },
  pagination: {
    table: PaginationTableExample,
  },
  switch: {
    preferences: SwitchPreferencesExample,
  },
  tabs: {
    settings: TabsSettingsExample,
  },
  timeline: {
    deployments: TimelineDeploymentsExample,
  },
};
