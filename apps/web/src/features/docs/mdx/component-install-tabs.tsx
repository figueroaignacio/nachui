import { Typography } from '@repo/ui/components/typography';
import { Steps } from '@repo/ui/components/steps';
import { useTranslations } from 'next-intl';
import { ComponentInstallTabsClient } from './component-install-tabs-client';
import { ComponentSource } from './component-source';
import { PackageManagerTabs } from './package-manager-tabs';

interface ComponentInstallTabsProps {
  component: string;
  dependencies?: string;
}

export function ComponentInstallTabs({ component, dependencies }: ComponentInstallTabsProps) {
  const t = useTranslations('components.componentInstallTabs');

  const manualContent = (
    <Steps>
      {dependencies ? (
        <>
          <Typography variant="h4">{t('dependencies')}</Typography>
          <PackageManagerTabs command={dependencies} />
          <Typography variant="h4">{t('copyCode')}</Typography>
          <ComponentSource component={component} />
          <Typography variant="h4">{t('updatePaths')}</Typography>
        </>
      ) : (
        <>
          <Typography variant="h4" className="text-sm">
            {t('copyCode')}
          </Typography>
          <ComponentSource component={component} />
          <Typography variant="h4" className="text-sm">
            {t('updatePaths')}
          </Typography>
        </>
      )}
    </Steps>
  );

  return <ComponentInstallTabsClient component={component} manualContent={manualContent} />;
}
