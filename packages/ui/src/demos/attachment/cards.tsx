'use client';

import { Attachment } from '../../components/attachment';

const photos = [
  { name: 'office-lobby.jpg', size: 2_140_000, src: 'https://picsum.photos/seed/lobby/320/320' },
  { name: 'team-offsite.jpg', size: 3_020_000, src: 'https://picsum.photos/seed/offsite/320/320' },
  { name: 'launch-day.jpg', size: 1_870_000, src: 'https://picsum.photos/seed/launch/320/320' },
];

export function Cards() {
  return (
    <Attachment.List layout="grid">
      {photos.map((photo) => (
        <Attachment.Item key={photo.name}>
          <Attachment variant="card">
            <Attachment.Preview src={photo.src} name={photo.name} />
            <Attachment.Content>
              <Attachment.Name>{photo.name}</Attachment.Name>
              <Attachment.Meta>
                <Attachment.Size bytes={photo.size} />
              </Attachment.Meta>
            </Attachment.Content>
            <Attachment.Actions>
              <Attachment.Remove />
            </Attachment.Actions>
          </Attachment>
        </Attachment.Item>
      ))}
    </Attachment.List>
  );
}
