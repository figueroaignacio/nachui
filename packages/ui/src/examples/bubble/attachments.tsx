import { Bubble } from '../../components/bubble';
import { FileIcon } from '../../icons/file';

export function Attachments() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Bubble.Group align="start">
        <Bubble variant="secondary">
          <Bubble.Content>Here is the deck for tomorrow.</Bubble.Content>
        </Bubble>
        <Bubble variant="outline">
          <Bubble.Content className="flex items-center gap-3">
            <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
              <FileIcon size={18} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">q3-review.pdf</span>
              <span className="text-muted-foreground text-xs">2.4 MB</span>
            </span>
          </Bubble.Content>
          <Bubble.Reactions side="bottom" align="end">
            <span aria-hidden="true">🙌</span>
            <span className="text-muted-foreground px-0.5">3</span>
          </Bubble.Reactions>
        </Bubble>
      </Bubble.Group>
      <Bubble.Group align="end">
        <Bubble align="end">
          <Bubble.Content>Got it, reviewing tonight.</Bubble.Content>
        </Bubble>
      </Bubble.Group>
    </div>
  );
}
