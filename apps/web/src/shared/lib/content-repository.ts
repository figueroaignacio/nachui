import { allDocs, allSkills, type Doc } from 'content-collections';

type Skill = (typeof allSkills)[number];

export const ContentRepository = {
  getDocs(locale?: string): Doc[] {
    const docs = Array.isArray(allDocs) ? allDocs : [];
    return locale ? docs.filter((doc) => doc.locale === locale) : docs;
  },

  getDocBySlug(slug: string, locale: string): Doc | undefined {
    return this.getDocs(locale).find((doc) => doc.slugAsParams === slug);
  },

  getSkills(): Skill[] {
    const skills = Array.isArray(allSkills) ? allSkills : [];
    return skills;
  },
};
