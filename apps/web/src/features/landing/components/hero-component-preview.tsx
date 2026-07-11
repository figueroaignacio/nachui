import { PreviewAccordion } from './preview-cards/preview-accordion';
import { PreviewActivity } from './preview-cards/preview-activity';
import { PreviewAnalytics } from './preview-cards/preview-analytics';
import { PreviewBadges } from './preview-cards/preview-badges';
import { PreviewButtonVariants } from './preview-cards/preview-button-variants';
import { PreviewColorTokens } from './preview-cards/preview-color-tokens';
import { PreviewControls } from './preview-cards/preview-controls';
import { PreviewDeploy } from './preview-cards/preview-deploy';
import { PreviewFiles } from './preview-cards/preview-files';
import { PreviewMenu } from './preview-cards/preview-menu';
import { PreviewMfa } from './preview-cards/preview-mfa';
import { PreviewNotifications } from './preview-cards/preview-notifications';
import { PreviewProfile } from './preview-cards/preview-profile';
import { PreviewProjectActions } from './preview-cards/preview-project-actions';
import { PreviewSchema } from './preview-cards/preview-schema';
import { PreviewSpinners } from './preview-cards/preview-spinners';
import { PreviewStatus } from './preview-cards/preview-status';
import { PreviewTabs } from './preview-cards/preview-tabs';
import { PreviewTasks } from './preview-cards/preview-tasks';
import { PreviewTeam } from './preview-cards/preview-team';
import { PreviewUpgrade } from './preview-cards/preview-upgrade';
import { PreviewWorkspace } from './preview-cards/preview-workspace';

const cards = [
  <PreviewProfile key="profile" />,
  <PreviewAnalytics key="analytics" />,
  <PreviewActivity key="activity" />,
  <PreviewMfa key="mfa" />,
  <PreviewWorkspace key="workspace" />,
  <PreviewProjectActions key="project-actions" />,
  <PreviewTasks key="tasks" />,
  <PreviewColorTokens key="color-tokens" />,
  <PreviewDeploy key="deploy" />,
  <PreviewControls key="controls" />,
  <PreviewAccordion key="accordion" />,
  <PreviewMenu key="menu" />,
  <PreviewFiles key="files" />,
  <PreviewButtonVariants key="button-variants" />,
  <PreviewBadges key="badges" />,
  <PreviewSpinners key="spinners" />,
  <PreviewStatus key="status" />,
  <PreviewSchema key="schema" />,
  <PreviewTabs key="tabs" />,
  <PreviewTeam key="team" />,
  <PreviewNotifications key="notifications" />,
  <PreviewUpgrade key="upgrade" />,
];

export function HeroComponentPreview() {
  return (
    <div className="relative w-full overflow-hidden" aria-label="Component showcase">
      <div className="columns-1 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4">
        {cards.map((card) => (
          <div key={card.key} className="mb-4 break-inside-avoid">
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}
