'use client';

import { Label } from '../../components/label';
import { Select } from '../../components/select';

const teams = [
  {
    label: 'Engineering',
    members: [
      { value: 'lucia', label: 'Lucia Mendez' },
      { value: 'marco', label: 'Marco Rivas' },
      { value: 'priya', label: 'Priya Nair' },
    ],
  },
  {
    label: 'Design',
    members: [
      { value: 'ines', label: 'Ines Duarte' },
      { value: 'tomas', label: 'Tomas Fuentes' },
    ],
  },
  {
    label: 'Support',
    members: [
      { value: 'noa', label: 'Noa Bergman' },
      { value: 'hugo', label: 'Hugo Salas' },
    ],
  },
];

export function GroupedItems() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="assignee">Assign ticket to</Label>
      <Select>
        <Select.Trigger id="assignee" placeholder="Unassigned" />
        <Select.Content>
          {teams.map((team) => (
            <Select.Group key={team.label}>
              <Select.Label>{team.label}</Select.Label>
              {team.members.map((member) => (
                <Select.Item key={member.value} value={member.value}>
                  {member.label}
                </Select.Item>
              ))}
            </Select.Group>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
}
