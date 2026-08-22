import { Label } from '../../components/label';
import { Switch } from '../../components/switch';

const features = [
  {
    id: 'nightly-backups',
    label: 'Nightly backups',
    hint: 'Always on for production projects.',
    defaultChecked: true,
  },
  {
    id: 'audit-log',
    label: 'Audit log export',
    hint: 'Available on the Enterprise plan.',
    defaultChecked: false,
  },
];

export function Disabled() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {features.map((feature) => (
        <div key={feature.id} className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor={feature.id} className="opacity-50">
              {feature.label}
            </Label>
            <span className="text-muted-foreground text-xs">{feature.hint}</span>
          </div>
          <Switch
            id={feature.id}
            defaultChecked={feature.defaultChecked}
            className="mt-0.5"
            disabled
          />
        </div>
      ))}
    </div>
  );
}
