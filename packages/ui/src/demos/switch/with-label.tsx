import { Label } from '../../components/label';
import { Switch } from '../../components/switch';

const preferences = [
  {
    id: 'incident-sms',
    label: 'Incident SMS',
    hint: 'Text the on call engineer when a service goes down.',
    defaultChecked: true,
  },
  {
    id: 'usage-alerts',
    label: 'Usage alerts',
    hint: 'Warn the workspace owner at 80% of the plan limit.',
    defaultChecked: false,
  },
];

export function WithLabel() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {preferences.map((preference) => (
        <div key={preference.id} className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor={preference.id}>{preference.label}</Label>
            <span className="text-muted-foreground text-xs">{preference.hint}</span>
          </div>
          <Switch
            id={preference.id}
            defaultChecked={preference.defaultChecked}
            className="mt-0.5"
          />
        </div>
      ))}
    </div>
  );
}
