import { Checkbox } from '../../components/checkbox';
import { Label } from '../../components/label';

const policies = [
  {
    id: 'policy-2fa',
    label: 'Require two factor authentication',
    hint: 'Enforced by your identity provider.',
    defaultChecked: true,
  },
  {
    id: 'policy-saml',
    label: 'Sign in with SAML only',
    hint: 'Available on the Enterprise plan.',
    defaultChecked: false,
  },
];

export function Disabled() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <p className="text-sm font-medium">Workspace security</p>
      {policies.map((policy) => (
        <div key={policy.id} className="flex items-start gap-2.5">
          <Checkbox
            id={policy.id}
            defaultChecked={policy.defaultChecked}
            className="mt-0.5"
            disabled
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor={policy.id} className="opacity-50">
              {policy.label}
            </Label>
            <span className="text-muted-foreground text-xs">{policy.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
