// GENERATED FILE, DO NOT EDIT.
// Run `pnpm --filter @repo/ui generate:registry` after adding a component,
// a demo, a brick or an icon. The build fails if this file is out of date.

import dynamic from 'next/dynamic';

export const EXAMPLE_COMPONENTS: Record<string, Record<string, React.ComponentType>> = {
  accordion: {
    icons: dynamic(() => import('@repo/ui/src/examples/accordion/icons').then((m) => m.Icons)),
  },
  avatar: {
    team: dynamic(() => import('@repo/ui/src/examples/avatar/team').then((m) => m.Team)),
  },
  badge: {
    statuses: dynamic(() => import('@repo/ui/src/examples/badge/statuses').then((m) => m.Statuses)),
  },
  bubble: {
    attachments: dynamic(() => import('@repo/ui/src/examples/bubble/attachments').then((m) => m.Attachments)),
  },
  button: {
    toolbar: dynamic(() => import('@repo/ui/src/examples/button/toolbar').then((m) => m.Toolbar)),
  },
  card: {
    stats: dynamic(() => import('@repo/ui/src/examples/card/stats').then((m) => m.Stats)),
  },
  'context-menu': {
    'track-list': dynamic(() => import('@repo/ui/src/examples/context-menu/track-list').then((m) => m.TrackList)),
  },
  dialog: {
    confirm: dynamic(() => import('@repo/ui/src/examples/dialog/confirm').then((m) => m.Confirm)),
  },
  empty: {
    inbox: dynamic(() => import('@repo/ui/src/examples/empty/inbox').then((m) => m.Inbox)),
  },
  'file-upload': {
    documents: dynamic(() => import('@repo/ui/src/examples/file-upload/documents').then((m) => m.Documents)),
  },
  frame: {
    nested: dynamic(() => import('@repo/ui/src/examples/frame/nested').then((m) => m.Nested)),
  },
  'icon-tile': {
    'feature-list': dynamic(() => import('@repo/ui/src/examples/icon-tile/feature-list').then((m) => m.FeatureList)),
  },
  input: {
    'sign-in': dynamic(() => import('@repo/ui/src/examples/input/sign-in').then((m) => m.SignIn)),
  },
  message: {
    assistant: dynamic(() => import('@repo/ui/src/examples/message/assistant').then((m) => m.Assistant)),
  },
  pagination: {
    table: dynamic(() => import('@repo/ui/src/examples/pagination/table').then((m) => m.Table)),
  },
  switch: {
    preferences: dynamic(() => import('@repo/ui/src/examples/switch/preferences').then((m) => m.Preferences)),
  },
  tabs: {
    settings: dynamic(() => import('@repo/ui/src/examples/tabs/settings').then((m) => m.Settings)),
  },
  timeline: {
    deployments: dynamic(() => import('@repo/ui/src/examples/timeline/deployments').then((m) => m.Deployments)),
  },
};
