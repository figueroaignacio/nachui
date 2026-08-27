import { Bubble } from '../../components/bubble';

export function Default() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Bubble.Group align="start">
        <Bubble variant="secondary">
          <Bubble.Content>Hey, did you ship the new docs page?</Bubble.Content>
        </Bubble>
        <Bubble variant="secondary">
          <Bubble.Content>The nav check is failing on my branch.</Bubble.Content>
        </Bubble>
      </Bubble.Group>
      <Bubble.Group align="end">
        <Bubble align="end">
          <Bubble.Content>Just pushed the fix, pull and rerun it.</Bubble.Content>
          <Bubble.Reactions side="bottom" align="start">
            <span aria-hidden="true">👍</span>
            <span className="text-muted-foreground px-0.5">2</span>
          </Bubble.Reactions>
        </Bubble>
      </Bubble.Group>
    </div>
  );
}
