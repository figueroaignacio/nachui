'use client';

import { Accordion } from '../../components/accordion';

const sections = [
  {
    value: 'authentication',
    trigger: 'Authentication',
    content:
      'Send your secret key as a bearer token on every request. Keys are scoped per project, so a test key never touches live orders.',
  },
  {
    value: 'rate-limits',
    trigger: 'Rate limits',
    content:
      'The API allows 600 requests per minute per key. Every response carries the remaining budget in X-RateLimit-Remaining, and a 429 tells you how long to wait.',
  },
  {
    value: 'webhooks',
    trigger: 'Webhook retries',
    content:
      'A webhook that does not return a 2xx within 5 seconds is retried 8 times over 24 hours with exponential backoff. Reply fast and queue the work on your side.',
  },
  {
    value: 'versioning',
    trigger: 'Versioning',
    content:
      'Your account is pinned to the API version that was current when you signed up. Breaking changes ship under a new date version and never move you off yours.',
  },
];

export function Collapsed() {
  return (
    <Accordion type="single" className="w-full max-w-md">
      {sections.map((section) => (
        <Accordion.Item key={section.value} value={section.value}>
          <Accordion.Trigger value={section.value}>{section.trigger}</Accordion.Trigger>
          <Accordion.Content value={section.value} className="text-muted-foreground text-sm">
            {section.content}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
