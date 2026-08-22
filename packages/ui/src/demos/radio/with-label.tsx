import { Label } from '../../components/label';
import { Radio } from '../../components/radio';

const frequencies = [
  {
    id: 'digest-realtime',
    label: 'Right away',
    hint: 'One email per event.',
    defaultChecked: false,
  },
  {
    id: 'digest-daily',
    label: 'Daily digest',
    hint: 'Everything from the last 24 hours, at 8:00.',
    defaultChecked: true,
  },
  {
    id: 'digest-weekly',
    label: 'Weekly summary',
    hint: 'Monday mornings only.',
    defaultChecked: false,
  },
];

export function WithLabel() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <p className="text-sm font-medium">Send activity email</p>
      {frequencies.map((frequency) => (
        <div key={frequency.id} className="flex items-start gap-2.5">
          <Radio
            id={frequency.id}
            name="digest-frequency"
            defaultChecked={frequency.defaultChecked}
            className="mt-0.5"
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor={frequency.id}>{frequency.label}</Label>
            <span className="text-muted-foreground text-xs">{frequency.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
