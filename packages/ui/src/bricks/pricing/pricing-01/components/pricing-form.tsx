'use client';

import { Badge } from '../../../../components/badge';
import { Button } from '../../../../components/button';
import { Card } from '../../../../components/card';

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-primary mt-0.5"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const TIERS = [
  {
    name: 'Starter',
    price: '$9',
    cadence: '/mo',
    description: 'For personal projects and prototypes.',
    badge: undefined as string | undefined,
    cta: 'Start free trial',
    features: ['10 components', 'Community support', 'Basic theming'],
  },
  {
    name: 'Pro',
    price: '$29',
    cadence: '/mo',
    description: 'For teams shipping production UIs.',
    badge: 'Most popular',
    cta: 'Upgrade to Pro',
    features: ['Unlimited components', 'Bricks library', 'Priority support'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    description: 'For orgs that need security and SLAs.',
    badge: 'SLA',
    cta: 'Contact sales',
    features: ['Dedicated support', 'SSO + audit logs', 'Custom registry'],
  },
] as const;

export function Pricing01() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-sm">Pricing</p>
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight">
            Ship faster with copy-paste UI
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm leading-relaxed">
            Pick a plan that matches your pace. Upgrade anytime.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={tier.name === 'Pro' ? 'ring-primary/20 relative ring-2' : 'relative'}
            >
              <Card.Header>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Card.Title className="text-base">{tier.name}</Card.Title>
                    <Card.Description>{tier.description}</Card.Description>
                  </div>
                  {tier.badge ? <Badge variant="secondary">{tier.badge}</Badge> : null}
                </div>
              </Card.Header>

              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-foreground text-4xl font-extrabold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground text-sm">{tier.cadence}</span>
                  </div>

                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm">
                        <CheckIcon />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card.Content>

              <Card.Footer>
                <Button fullWidth variant={tier.name === 'Pro' ? 'default' : 'secondary'}>
                  {tier.cta}
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
