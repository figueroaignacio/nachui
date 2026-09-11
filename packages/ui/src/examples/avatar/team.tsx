'use client';

import { Avatar } from '../../components/avatar';
import { Badge } from '../../components/badge';

const members = [
  { name: 'Lucia Rey', initials: 'LR', role: 'Owner' },
  { name: 'Marco Sosa', initials: 'MS', role: 'Admin' },
  { name: 'Ana Torres', initials: 'AT', role: 'Member' },
];

export function Team() {
  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border">
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-medium">Team</span>
        <Avatar.Group>
          {members.map((member) => (
            <Avatar key={member.name} size="sm">
              <Avatar.Fallback className="text-xs">{member.initials}</Avatar.Fallback>
            </Avatar>
          ))}
        </Avatar.Group>
      </div>
      <ul className="divide-border divide-y">
        {members.map((member) => (
          <li key={member.name} className="flex items-center gap-3 px-4 py-3">
            <Avatar size="sm">
              <Avatar.Fallback className="text-xs">{member.initials}</Avatar.Fallback>
            </Avatar>
            <span className="flex-1 text-sm">{member.name}</span>
            <Badge variant="outline">{member.role}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
