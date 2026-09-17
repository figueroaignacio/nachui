'use client';

import { Attachments, type AttachmentData } from '@repo/ui/ai/attachments';
import { Card } from '@repo/ui/components/card';

const SOURCES: AttachmentData[] = [
  { id: '1', filename: 'architecture.pdf', mediaType: 'application/pdf', size: 248320 },
  { id: '2', filename: 'schema.sql', mediaType: 'text/plain', size: 18440 },
  { id: '3', filename: 'incident-0412.md', mediaType: 'text/markdown', size: 6120 },
];

export function PreviewSources() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Sources</Card.Title>
        <Card.Description className="text-xs">
          Grounding this answer, 3 of 12 indexed.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4">
        <Attachments variant="list">
          {SOURCES.map((source) => (
            <Attachments.Item key={source.id} data={source}>
              <Attachments.Preview />
              <Attachments.Info />
              <Attachments.Remove />
            </Attachments.Item>
          ))}
        </Attachments>
      </Card.Content>
    </Card>
  );
}
