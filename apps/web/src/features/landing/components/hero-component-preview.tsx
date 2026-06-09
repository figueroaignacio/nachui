import { Container } from '@repo/ui/layout/container';
import { Grid } from '@repo/ui/layout/grid';
import { Stack } from '@repo/ui/layout/stack';
import { PreviewAccordion } from './preview-cards/preview-accordion';
import { PreviewControls } from './preview-cards/preview-controls';
import { PreviewDeploy } from './preview-cards/preview-deploy';
import { PreviewMfa } from './preview-cards/preview-mfa';
import { PreviewProfile } from './preview-cards/preview-profile';
import { PreviewProjectActions } from './preview-cards/preview-project-actions';
import { PreviewTasks } from './preview-cards/preview-tasks';
import { PreviewWorkspace } from './preview-cards/preview-workspace';

export function HeroComponentPreview() {
  return (
    <Container className="relative mt-24 px-0" size="fluid">
      {/* Floating Interactive Canvas */}
      <div>
        <Grid columns="1" gap="8" className="sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1 */}
          <Stack gap="8">
            <PreviewProfile />
            <PreviewProjectActions />
            <PreviewAccordion />
          </Stack>

          {/* Column 2 */}
          <Stack gap="8" className="sm:mt-4 lg:mt-8">
            <PreviewWorkspace />
            <PreviewControls />
            <PreviewTasks />
          </Stack>

          {/* Column 3 */}
          <Stack
            gap="8"
            className="gap-8 sm:col-span-2 sm:grid sm:grid-cols-2 lg:col-span-1 lg:flex lg:flex-col"
          >
            <PreviewMfa />
            <PreviewDeploy />
          </Stack>
        </Grid>
      </div>
    </Container>
  );
}
