'use client';

import { useCopyToClipboard } from '@/features/docs/hooks/use-copy-to-clipboard';
import { getSkillInstallCommand, type SerializedSkill } from '@/features/skills/lib/skills';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { SkillsFooter } from '../components/skills-footer';
import { SkillsHeader } from '../components/skills-header';
import { SkillsRow } from '../components/skills-row';
import { SkillsSearchInput } from '../components/skills-search-input';

export type SkillsViewProps = {
  initialSkills: SerializedSkill[];
  initialQuery?: string;
};

export function SkillsView({ initialSkills, initialQuery }: SkillsViewProps) {
  const t = useTranslations('components.skillsList');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(initialQuery ?? '');
  const { copyToClipboard } = useCopyToClipboard(2000);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(q);
  }, [searchParams]);

  const filtered = initialSkills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCopy = (slug: string) => {
    copyToClipboard(getSkillInstallCommand(slug));
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);

    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set('q', value);
    else params.delete('q');

    startTransition(() => {
      const qs = params.toString();
      router.replace((qs ? `${pathname}?${qs}` : pathname) as Route);
    });
  };

  return (
    <div className="bg-background min-h-svh py-10">
      <SkillsHeader totalCount={initialSkills.length} />
      <SkillsSearchInput value={search} onChange={handleSearchChange} />

      <div className="border-border text-muted-foreground bleed-x hidden grid-cols-[2rem_1fr_auto] gap-4 border-b border-dashed py-3 font-mono text-xs font-medium uppercase lg:grid">
        <span>#</span>
        <span>{t('columns.skill')}</span>
        <span>{t('columns.install')}</span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-10 text-center font-mono text-sm">
          {t('noResults', { query: search })}
        </p>
      ) : (
        <ul>
          {filtered.map((skill, idx) => (
            <SkillsRow
              key={skill.slug}
              index={idx + 1}
              skill={skill}
              copied={copiedId === skill.slug}
              onCopy={handleCopy}
            />
          ))}
        </ul>
      )}

      <SkillsFooter />
    </div>
  );
}
