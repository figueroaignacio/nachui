'use client';

import { Badge } from '../../components/badge';
import { Collapsible } from '../../components/collapsible';

const incidents = [
  {
    title: 'Elevated API latency in eu-central',
    date: 'Mar 14',
    status: 'Resolved',
    tone: 'success',
    updates: [
      { time: '09:12', text: 'Investigating slow responses on /v1/orders.' },
      { time: '09:41', text: 'Traced to a saturated read replica, traffic shifted to iad1.' },
      { time: '10:05', text: 'Latency back to normal, replica replaced.' },
    ],
  },
  {
    title: 'Webhook deliveries delayed',
    date: 'Mar 12',
    status: 'Monitoring',
    tone: 'warning',
    updates: [
      { time: '17:20', text: 'Delivery queue backed up behind a retry storm.' },
      { time: '17:55', text: 'Queue drained, watching retry rates for the next few hours.' },
    ],
  },
] as const;

export function Card() {
  return (
    <div className="w-full max-w-md space-y-3">
      {incidents.map((incident, index) => (
        <Collapsible key={incident.title} variant="card" defaultOpen={index === 0}>
          <Collapsible.Trigger>
            <span className="flex flex-col items-start gap-1">
              <span className="flex items-center gap-2">
                <Badge variant={incident.tone}>{incident.status}</Badge>
                <span className="text-muted-foreground text-xs">{incident.date}</span>
              </span>
              <span className="text-left text-sm font-medium">{incident.title}</span>
            </span>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <ol className="border-border ml-1 space-y-3 border-l pt-1 pl-4">
              {incident.updates.map((update) => (
                <li key={update.time} className="text-sm">
                  <span className="text-muted-foreground mr-2 font-mono text-xs">
                    {update.time}
                  </span>
                  {update.text}
                </li>
              ))}
            </ol>
          </Collapsible.Content>
        </Collapsible>
      ))}
    </div>
  );
}
