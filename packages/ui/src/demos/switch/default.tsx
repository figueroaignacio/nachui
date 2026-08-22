import { Switch } from '../../components/switch';

const settings = [
  { id: 'auto-deploy', label: 'Deploy on push to main', defaultChecked: true },
  { id: 'preview-urls', label: 'Preview URL for every pull request', defaultChecked: true },
  { id: 'maintenance', label: 'Maintenance mode', defaultChecked: false },
];

export function Default() {
  return (
    <div className="border-border bg-card w-full max-w-md rounded-xl border">
      {settings.map((setting) => (
        <div
          key={setting.id}
          className="border-border flex items-center justify-between gap-4 border-b p-3.5 last:border-b-0"
        >
          <span id={`${setting.id}-label`} className="text-sm">
            {setting.label}
          </span>
          <Switch aria-labelledby={`${setting.id}-label`} defaultChecked={setting.defaultChecked} />
        </div>
      ))}
    </div>
  );
}
