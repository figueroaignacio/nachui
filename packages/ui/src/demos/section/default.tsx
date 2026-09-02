import { Button } from '../../components/button';
import { Section } from '../../layout/section';

const features = [
  { title: 'Preview deploys', detail: 'A URL for every branch, torn down on merge.' },
  { title: 'Edge caching', detail: 'Static output served from 30 regions.' },
  { title: 'Rollbacks', detail: 'Back to any previous build in one click.' },
];

export function Default() {
  return (
    <Section size="sm" background="card" className="w-full max-w-2xl rounded-xl">
      <Section.Header>
        <Section.Eyebrow>Platform</Section.Eyebrow>
        <Section.Title>Ship from a pull request</Section.Title>
        <Section.Description>
          Everything between git push and production, without a pipeline to maintain.
        </Section.Description>
        <Section.Actions>
          <Button size="sm">Start deploying</Button>
          <Button size="sm" variant="outline">
            Read the docs
          </Button>
        </Section.Actions>
      </Section.Header>
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col gap-1">
            <p className="text-sm font-medium">{feature.title}</p>
            <p className="text-muted-foreground text-xs">{feature.detail}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
