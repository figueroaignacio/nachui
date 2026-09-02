import { Button } from '../../components/button';
import { Section } from '../../layout/section';

export function Centered() {
  return (
    <Section size="md" bordered className="w-full max-w-2xl">
      <Section.Header align="center" spacing="sm">
        <Section.Eyebrow>Pricing</Section.Eyebrow>
        <Section.Title>Pay for what you deploy</Section.Title>
        <Section.Description>
          Free for hobby projects. Usage-based from the first team member, with no seat minimum.
        </Section.Description>
        <Section.Actions className="justify-center">
          <Button size="sm">Compare plans</Button>
        </Section.Actions>
      </Section.Header>
    </Section>
  );
}
