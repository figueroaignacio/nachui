export type SkillSlug = string;

export type SerializedSkill = {
  slug: string;
  name: string;
  description: string;
};

export function getSkillInstallCommand(slug: SkillSlug) {
  return `npx skills add github:figueroaignacio/ui-skills/skills/${slug}`;
}

export function getSkillSourceUrl(slug: SkillSlug) {
  return `https://github.com/figueroaignacio/ui-skills/blob/main/skills/${slug}/SKILL.md`;
}
