import { Link } from '@/i18n/navigation';
import { getSkillInstallCommand } from '../lib/skills';
import { SkillsCopyButton } from './skills-copy-button';
import type { SerializedSkill } from '../lib/skills';

export type SkillsRowProps = {
  index: number;
  skill: SerializedSkill;
  copied: boolean;
  onCopy: (slug: string) => void;
};

export function SkillsRow({ index, skill, copied, onCopy }: SkillsRowProps) {
  return (
    <li className="border-border bleed-x group hover:bg-muted/20 border-b transition-colors last:border-0">
      <div className="grid grid-cols-[2rem_1fr_auto] items-center gap-4 px-0 py-4">
        <span className="text-muted-foreground font-mono text-base tabular-nums">{index}</span>
        <Link href={`/skills/${skill.slug}`} className="flex min-w-0 flex-col lg:gap-3">
          <span className="text-foreground group-hover:text-foreground/80 truncate text-base font-medium transition-colors">
            {skill.name}
          </span>
          <span className="text-muted-foreground mt-0.5 truncate font-mono text-sm lg:mt-0">
            {skill.description}
          </span>
        </Link>
        <SkillsCopyButton
          onClick={() => onCopy(skill.slug)}
          title={getSkillInstallCommand(skill.slug)}
          copied={copied}
        />
      </div>
    </li>
  );
}
