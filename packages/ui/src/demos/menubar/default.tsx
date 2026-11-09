'use client';

import * as React from 'react';
import { Menubar } from '../../components/menubar';

const ZOOM_LEVELS = ['75%', '100%', '125%', '150%'];

const RECENT_FILES = ['release-notes.md', 'onboarding-guide.md', 'q3-roadmap.md'];

export function Default() {
  const [showRuler, setShowRuler] = React.useState(true);
  const [wordWrap, setWordWrap] = React.useState(false);
  const [zoom, setZoom] = React.useState('100%');

  return (
    <Menubar aria-label="Editor">
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item shortcut="⌘N">New file</Menubar.Item>
          <Menubar.Item shortcut="⌘O">Open…</Menubar.Item>
          <Menubar.Sub>
            <Menubar.SubTrigger>Open recent</Menubar.SubTrigger>
            <Menubar.SubContent>
              {RECENT_FILES.map((file) => (
                <Menubar.Item key={file}>{file}</Menubar.Item>
              ))}
            </Menubar.SubContent>
          </Menubar.Sub>
          <Menubar.Separator />
          <Menubar.Item shortcut="⌘S">Save</Menubar.Item>
          <Menubar.Item shortcut="⇧⌘S">Save as…</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item shortcut="⌘P">Print</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item shortcut="⌘Z">Undo</Menubar.Item>
          <Menubar.Item shortcut="⇧⌘Z">Redo</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item shortcut="⌘X">Cut</Menubar.Item>
          <Menubar.Item shortcut="⌘C">Copy</Menubar.Item>
          <Menubar.Item shortcut="⌘V">Paste</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Sub>
            <Menubar.SubTrigger>Find</Menubar.SubTrigger>
            <Menubar.SubContent>
              <Menubar.Item shortcut="⌘F">Find…</Menubar.Item>
              <Menubar.Item shortcut="⌘G">Find next</Menubar.Item>
              <Menubar.Item shortcut="⇧⌘G">Find previous</Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item shortcut="⌥⌘F">Replace…</Menubar.Item>
            </Menubar.SubContent>
          </Menubar.Sub>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.CheckboxItem checked={showRuler} onCheckedChange={setShowRuler}>
            Show ruler
          </Menubar.CheckboxItem>
          <Menubar.CheckboxItem checked={wordWrap} onCheckedChange={setWordWrap}>
            Word wrap
          </Menubar.CheckboxItem>
          <Menubar.Separator />
          <Menubar.Label>Zoom</Menubar.Label>
          <Menubar.RadioGroup value={zoom} onValueChange={setZoom} aria-label="Zoom">
            {ZOOM_LEVELS.map((level) => (
              <Menubar.RadioItem key={level} value={level}>
                {level}
              </Menubar.RadioItem>
            ))}
          </Menubar.RadioGroup>
          <Menubar.Separator />
          <Menubar.Item shortcut="⌃⌘F">Enter full screen</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Help</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item shortcut="⌘/">Keyboard shortcuts</Menubar.Item>
          <Menubar.Item>Documentation</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item>Report an issue</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
}
