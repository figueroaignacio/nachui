import { Callout } from '../../components/callout';

export function Success() {
  return (
    <Callout variant="success" className="max-w-lg">
      <Callout.Title>Recommended</Callout.Title>
      <Callout.Content>
        Since v2.3 the compiler memoizes render output for you. New code can drop manual useMemo and
        useCallback wrappers around cheap values.
      </Callout.Content>
    </Callout>
  );
}
