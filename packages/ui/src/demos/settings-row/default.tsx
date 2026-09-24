'use client';

import { useState } from 'react';
import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { SettingsRow } from '../../hybrids/settings-row';

const FREQUENCIES = [
  { value: 'instant', label: 'Instantly' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily digest' },
];

export function Default() {
  const [email, setEmail] = useState(true);
  const [frequency, setFrequency] = useState('daily');
  const [replyTo, setReplyTo] = useState('nacho@example.com');

  return (
    <div className="w-full max-w-xl">
      <SettingsRow.Section
        title="Notifications"
        description="How and when NachUI reaches you."
        footer={
          <Button size="sm" type="button">
            Save changes
          </Button>
        }
      >
        <SettingsRow label="Email alerts" description="One email for every event on your account.">
          <SettingsRow.Switch checked={email} onCheckedChange={setEmail} />
        </SettingsRow>
        <SettingsRow
          label="Frequency"
          description="How often the alerts are bundled."
          badge={<Badge variant="secondary">Beta</Badge>}
          disabled={!email}
        >
          <SettingsRow.Select
            options={FREQUENCIES}
            value={frequency}
            onValueChange={setFrequency}
          />
        </SettingsRow>
        <SettingsRow label="Reply-to address" description="Shown on every email we send.">
          <SettingsRow.Input
            type="email"
            value={replyTo}
            onChange={(event) => setReplyTo(event.target.value)}
          />
        </SettingsRow>
      </SettingsRow.Section>
    </div>
  );
}
