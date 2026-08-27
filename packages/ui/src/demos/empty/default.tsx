import { Folder01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';
import { Empty } from '../../components/empty';

export function Default() {
  return (
    <Empty className="max-w-md">
      <Empty.Header>
        <Empty.Media variant="icon">
          <HugeiconsIcon icon={Folder01Icon} size={24} />
        </Empty.Media>
        <Empty.Title>No projects yet</Empty.Title>
        <Empty.Description>
          You have not created any projects. Create your first one to get started.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button size="sm">Create project</Button>
        <Button size="sm" variant="outline">
          Import
        </Button>
      </Empty.Content>
    </Empty>
  );
}
