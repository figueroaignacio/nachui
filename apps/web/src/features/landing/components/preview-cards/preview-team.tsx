import { Avatar } from '@repo/ui/components/avatar';
import { Card } from '@repo/ui/components/card';

const members = [
  { initials: 'AR', name: 'Ana Ruiz', role: 'owner' },
  { initials: 'TL', name: 'Tomás Luna', role: 'admin' },
  { initials: 'MP', name: 'Mora Paz', role: 'member' },
];

export function PreviewTeam() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Team</Card.Title>
      </Card.Header>
      <Card.Content compact className="space-y-3">
        {members.map((member) => (
          <div key={member.name} className="flex items-center gap-2.5">
            <Avatar size="sm">
              <Avatar.Fallback className="text-[11px]">{member.initials}</Avatar.Fallback>
            </Avatar>
            <span className="text-foreground flex-1 text-xs font-medium">{member.name}</span>
            <span className="text-muted-foreground font-mono text-[11px]">{member.role}</span>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
