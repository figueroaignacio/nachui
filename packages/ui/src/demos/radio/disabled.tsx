import { Label } from '../../components/label';
import { Radio } from '../../components/radio';

const regions = [
  {
    id: 'region-us',
    label: 'US East, Virginia',
    hint: 'Current region, set when the workspace was created.',
    defaultChecked: true,
  },
  {
    id: 'region-eu',
    label: 'Europe, Frankfurt',
    hint: 'Moving regions requires a support request.',
    defaultChecked: false,
  },
];

export function Disabled() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <p className="text-sm font-medium">Data region</p>
      {regions.map((region) => (
        <div key={region.id} className="flex items-start gap-2.5">
          <Radio
            id={region.id}
            name="data-region"
            defaultChecked={region.defaultChecked}
            className="mt-0.5"
            disabled
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor={region.id} className="opacity-50">
              {region.label}
            </Label>
            <span className="text-muted-foreground text-xs">{region.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
