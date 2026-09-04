'use client';

import { Label } from '../../components/label';
import { Select } from '../../components/select';

const regions = [
  { value: 'us-east-1', label: 'US East, Virginia' },
  { value: 'us-west-2', label: 'US West, Oregon' },
  { value: 'eu-central-1', label: 'Europe, Frankfurt' },
  { value: 'sa-east-1', label: 'South America, Sao Paulo' },
  { value: 'ap-southeast-1', label: 'Asia Pacific, Singapore' },
];

export function Default() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="deploy-region" description="Your database is created in the same region.">
        Deployment region
      </Label>
      <Select defaultValue="eu-central-1">
        <Select.Trigger id="deploy-region" placeholder="Pick a region" />
        <Select.Content>
          {regions.map((region) => (
            <Select.Item key={region.value} value={region.value}>
              {region.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
}
