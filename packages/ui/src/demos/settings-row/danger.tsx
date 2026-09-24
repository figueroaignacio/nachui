'use client';

import { useState } from 'react';
import { SettingsRow } from '../../hybrids/settings-row';

export function Danger() {
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="w-full max-w-xl">
      <SettingsRow.Section
        title="Danger zone"
        description="Keys and actions that are hard to undo."
        className="border-destructive-border"
      >
        <SettingsRow label="API key" description="Use it from the server only. Rotates on demand.">
          <SettingsRow.Value value="sk_live_4f2a…9c1e" copy />
        </SettingsRow>
        <SettingsRow label="Rotate key" description="The current key stops working right away.">
          <SettingsRow.Action>Rotate</SettingsRow.Action>
        </SettingsRow>
        <SettingsRow
          label="Delete account"
          description="Removes the workspace, its keys and every component synced to it."
        >
          <SettingsRow.Action variant="destructive" onClick={() => setDeleted(true)}>
            {deleted ? 'Scheduled' : 'Delete account'}
          </SettingsRow.Action>
        </SettingsRow>
      </SettingsRow.Section>
    </div>
  );
}
