'use client';

import { Attachment } from '../../components/attachment';

const files = [
  { name: 'q3-board-deck.pdf', type: 'application/pdf', size: 4_820_000 },
  { name: 'hero-final.png', type: 'image/png', size: 1_240_000 },
  { name: 'source-assets.zip', type: 'application/zip', size: 58_300_000 },
];

export function Default() {
  return (
    <Attachment.List className="w-full max-w-sm">
      {files.map((file) => (
        <Attachment.Item key={file.name}>
          <Attachment>
            <Attachment.Preview type={file.type} name={file.name} />
            <Attachment.Content>
              <Attachment.Name>{file.name}</Attachment.Name>
              <Attachment.Meta>
                <Attachment.Size bytes={file.size} />
              </Attachment.Meta>
            </Attachment.Content>
            <Attachment.Actions>
              <Attachment.Download href="#" />
              <Attachment.Remove />
            </Attachment.Actions>
          </Attachment>
        </Attachment.Item>
      ))}
    </Attachment.List>
  );
}
