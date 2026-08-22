'use client';

import { Avatar } from '../../components/avatar';
import { Badge } from '../../components/badge';
import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

const members = [
  { initials: 'NB', name: 'Nadia Brenner', email: 'nadia@acmestudio.dev', role: 'Owner' },
  { initials: 'TO', name: 'Tomas Ovalle', email: 'tomas@acmestudio.dev', role: 'Admin' },
  { initials: 'RK', name: 'Rhea Kapoor', email: 'rhea@acmestudio.dev', role: 'Viewer' },
];

export function Secondary() {
  return (
    <Stack gap="4" className="border-border bg-card w-full max-w-md rounded-xl border p-4">
      {members.map((member) => (
        <Flex key={member.email} align="center" justify="between" gap="4">
          <Flex align="center" gap="3" className="min-w-0">
            <Avatar>
              <Avatar.Fallback>{member.initials}</Avatar.Fallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <p className="text-muted-foreground truncate text-xs">{member.email}</p>
            </div>
          </Flex>
          <Badge variant="secondary">{member.role}</Badge>
        </Flex>
      ))}
    </Stack>
  );
}
