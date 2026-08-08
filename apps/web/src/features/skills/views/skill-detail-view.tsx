import { BackButton } from '@/components/common/back-button';
import { CopyButton } from '@/components/mdx/copy-button';
import { MDXContent } from '@/components/mdx/mdx-content';
import { getSkillInstallCommand, getSkillSourceUrl } from '@/features/skills/lib/skills';
import { Container } from '@repo/ui/layout/container';
import type { Skill } from 'content-collections';
import { getTranslations } from 'next-intl/server';

type SkillDetailViewProps = {
  skill: Skill;
};

export async function SkillDetailView({ skill }: SkillDetailViewProps) {
  const t = await getTranslations('components.skillDetail');

  const cliCommand = getSkillInstallCommand(skill.slug);
  const githubUrl = getSkillSourceUrl(skill.slug);

  return (
    <div className="bg-background min-h-svh">
      <Container size="md" className="px-0 py-10">
        <BackButton />

        {/* Header */}
        <div className="border-border mt-8 border-t border-dashed pt-8">
          <p className="section-label mb-4">Skill</p>
          <h1 className="font-heading text-foreground text-[2rem] leading-[1.05] font-semibold tracking-tight md:text-[2.5rem]">
            {skill.name}
          </h1>
          <p className="text-muted-foreground mt-3 font-mono text-[13px]">
            figueroaignacio/ui-skills ·{' '}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-2 transition-colors"
            >
              {t('viewSource')}
            </a>
          </p>

          {/* Install command */}
          <div className="border-border text-foreground bg-surface-muted mt-6 flex w-full max-w-lg items-center gap-3 border px-4 py-2.5 font-mono text-sm">
            <span className="text-muted-foreground shrink-0">$</span>
            <code className="flex-1 truncate text-sm select-all">{cliCommand}</code>
            <CopyButton
              value={cliCommand}
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            />
          </div>
        </div>

        {/* Trigger description */}
        <div className="border-border mt-8 border-t border-dashed pt-6">
          <p className="section-label mb-2">Triggers when</p>
          <p className="text-muted-strong font-mono text-[13px] leading-relaxed italic">
            {t('triggersWhen', { description: skill.description })}
          </p>
        </div>

        {/* MDX content */}
        <div className="border-border mt-8 border-t border-dashed pt-6">
          <article className="prose max-w-none">
            <MDXContent code={skill.body} />
          </article>
        </div>
      </Container>
    </div>
  );
}
