import { ContentRepository } from '@/lib/content-repository';
import { Command } from '@repo/ui/components/command';

const REPO = 'figueroaignacio/nachui';

function installCommand(slug: string) {
  return `npx skills add ${REPO} --skill ${slug}`;
}

function sourceUrl(slug: string) {
  return `https://github.com/${REPO}/blob/main/.agents/skills/${slug}/SKILL.md`;
}

export function SkillsList() {
  const skills = ContentRepository.getSkills();

  if (skills.length === 0) return null;

  return (
    <div className="border-border divide-border my-6 divide-y overflow-hidden rounded-lg border">
      {skills.map((skill) => {
        const command = installCommand(skill.slug);

        return (
          <div key={skill.slug} className="p-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-foreground font-mono text-sm font-medium">{skill.name}</span>
              <a
                href={sourceUrl(skill.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground shrink-0 font-mono text-xs transition-colors"
              >
                source ↗
              </a>
            </div>
            <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">
              {skill.summary}
            </p>
            <Command command={command} className="text-muted-strong mt-3 px-3 py-2 text-xs" />
          </div>
        );
      })}
    </div>
  );
}
