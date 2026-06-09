'use client';

import { Avatar } from '../../components/avatar';

const avatars = [
  { src: 'https://github.com/figueroaignacio.png', alt: '@figueroaignacio', fallback: 'FI' },
  { src: 'https://github.com/nicvazquezdev.png', alt: '@nicvazquezdev', fallback: 'NV' },
  { src: 'https://github.com/ManuZarraga.png', alt: '@ManuZarraga', fallback: 'MZ' },
];

export function AvatarGroup() {
  return (
    <Avatar.Group>
      {avatars.map((avatar) => (
        <Avatar key={avatar.alt}>
          <Avatar.Image src={avatar.src} alt={avatar.alt} />
          <Avatar.Fallback>{avatar.fallback}</Avatar.Fallback>
        </Avatar>
      ))}
      <Avatar>
        <Avatar.Fallback className="bg-muted text-muted-foreground">+3</Avatar.Fallback>
      </Avatar>
    </Avatar.Group>
  );
}
