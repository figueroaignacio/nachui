import { NavBadge } from '@/components/common/nav-badge';
import { DEMO_COMPONENTS } from '@/components/mdx/demo-registry';
import { DemoStage } from '@/features/docs/components/demo-stage';
import { DocActions } from '@/features/docs/components/doc-actions';
import { DocsPagination } from '@/features/docs/components/docs-pagination';
import { IssueCta } from '@/features/docs/components/issue-cta';
import type { TocEntry } from '@/features/docs/components/toc-tree';
import { SITE_URL } from '@/lib/constants';
import { findDocItem, getDocsSections } from '@/lib/docs-navigation';
import { GITHUB_REPO_URL, getAbsoluteUrl } from '@/lib/domains';
import { Callout } from '@repo/ui/components/callout';
import { COMPONENT_REGISTRY } from '@repo/ui/registry';
import type { Doc } from 'content-collections';
import { getTranslations } from 'next-intl/server';
import { MDXContent } from '../mdx/mdx-content';

interface ComponentDocViewProps {
  doc: Doc;
  preview: { component: string; demo: string };
}

const INSTALL_HEADING = /^#instal/i;
/**
 * A component page: its first demo on a stage that fills the first screen, and
 * the doc under it. Every other page keeps `DocView`.
 */
export async function ComponentDocView({ doc, preview }: ComponentDocViewProps) {
  const t = await getTranslations('docs');
  const currentPath = `/docs/${doc.slugAsParams}`;
  const locale = doc.locale || 'en';
  const docUrl = getAbsoluteUrl(locale, currentPath);
  const badge = findDocItem(getDocsSections(t), currentPath)?.badge;
  const name = doc.slugAsParams.split('/').at(-1);
  const componentPath = COMPONENT_REGISTRY[name as keyof typeof COMPONENT_REGISTRY];
  const sourceUrl = componentPath ? `${GITHUB_REPO_URL}/blob/main/${componentPath}` : undefined;
  const toc: TocEntry[] = Array.isArray(doc.toc?.content) ? doc.toc.content : [];
  const installHref = toc.find((entry) => INSTALL_HEADING.test(entry.url))?.url;

  const loadDemo = DEMO_COMPONENTS[preview.component]?.[preview.demo];
  const Demo = loadDemo ? await loadDemo() : undefined;

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: doc.title,
    description: doc.description,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: 'NachUI', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': docUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <DemoStage
        title={doc.title}
        url={docUrl}
        defaultKey={`${preview.component}/${preview.demo}`}
        defaultDemo={Demo ? <Demo /> : null}
        installHref={installHref}
      >
        <article className="@container min-w-0 pb-4">
          <header className="mt-2 mb-12">
            <h1 className="section-label tracking-[0.08em] uppercase">{doc.title}</h1>
            {doc.description && (
              <p className="font-heading text-foreground mt-4 text-2xl leading-snug font-semibold tracking-[-0.02em] text-pretty md:text-[1.75rem]">
                {doc.description}
              </p>
            )}
            <NavBadge badge={badge} className="mt-5" />
            <div className="mt-8">
              <DocActions
                page={doc.title}
                url={docUrl}
                filePath={doc.sourceFilePath}
                rawPath={`/${locale}${currentPath}.md`}
                sourceUrl={sourceUrl}
                hideExplain
              />
            </div>
          </header>
          <div data-doc-prose className="min-w-0 *:first:mt-0">
            {doc.body ? (
              <MDXContent code={doc.body} />
            ) : (
              <Callout variant="danger">
                <Callout.Title>{t('renderError')}</Callout.Title>
              </Callout>
            )}
          </div>
          <IssueCta pageTitle={doc.title} pageUrl={docUrl} />
          <DocsPagination currentPath={currentPath} />
        </article>
      </DemoStage>
    </>
  );
}
