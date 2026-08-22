import { Callout } from '../../components/callout';

export function Default() {
  return (
    <Callout className="max-w-lg">
      <Callout.Title>Note</Callout.Title>
      <Callout.Content>
        The CLI reads NACHUI_TOKEN from your shell first, then falls back to .env.local. Values in
        the shell always win.
      </Callout.Content>
    </Callout>
  );
}
