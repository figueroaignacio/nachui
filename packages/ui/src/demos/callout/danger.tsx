import { Callout } from '../../components/callout';

export function Danger() {
  return (
    <Callout variant="danger" className="max-w-lg">
      <Callout.Title>This cannot be undone</Callout.Title>
      <Callout.Content>
        Deleting a project removes its deploys, environment variables, and request logs. Custom
        domains are released and can be claimed by anyone.
      </Callout.Content>
    </Callout>
  );
}
