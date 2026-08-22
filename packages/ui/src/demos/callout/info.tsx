import { Callout } from '../../components/callout';

export function Info() {
  return (
    <Callout variant="info" className="max-w-lg">
      <Callout.Title>Good to know</Callout.Title>
      <Callout.Content>
        Preview deploys are kept for 30 days and then removed. Promote one to production if you need
        the URL to stay reachable.
      </Callout.Content>
    </Callout>
  );
}
