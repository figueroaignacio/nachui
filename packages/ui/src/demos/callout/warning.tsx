import { Callout } from '../../components/callout';

export function Warning() {
  return (
    <Callout variant="warning" className="max-w-lg">
      <Callout.Title>Breaking change in v3.0</Callout.Title>
      <Callout.Content>
        Button no longer forwards the asChild prop. Wrap the child in Slot yourself before you
        upgrade, or the link inside it renders as a nested button.
      </Callout.Content>
    </Callout>
  );
}
