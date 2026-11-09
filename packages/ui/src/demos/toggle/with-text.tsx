import { Toggle } from '../../components/toggle';
import { BookmarkIcon } from '../../icons/bookmark';

export function WithText() {
  return (
    <Toggle variant="outline" defaultPressed>
      <BookmarkIcon size={16} />
      Saved for later
    </Toggle>
  );
}
