import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';
import { Empty } from '../../components/empty';

export function Outline() {
  return (
    <Empty variant="outline" className="max-w-md">
      <Empty.Header>
        <Empty.Media variant="icon">
          <HugeiconsIcon icon={Search01Icon} size={24} />
        </Empty.Media>
        <Empty.Title>No results</Empty.Title>
        <Empty.Description>
          Nothing matched your search. Try a different term or clear the filters.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button size="sm" variant="ghost">
          Clear filters
        </Button>
      </Empty.Content>
    </Empty>
  );
}
