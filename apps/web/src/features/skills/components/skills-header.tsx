import { useTranslations } from 'next-intl';

export type SkillsHeaderProps = {
  totalCount: number;
};

export function SkillsHeader({ totalCount }: SkillsHeaderProps) {
  const t = useTranslations('components.skillsList');

  return (
    <div className="max-w-2xl pb-10">
      <h1 className="font-heading text-foreground text-[2rem] leading-[1.1] font-normal tracking-tight italic md:text-[2.75rem]">
        {t('title')}
      </h1>
      <p className="text-muted-strong mt-4 text-[15px] leading-relaxed">
        {t('description')}{' '}
        <span className="text-muted-foreground ml-1 font-mono text-[13px]">
          ({totalCount} {totalCount === 1 ? 'skill' : 'skills'} available)
        </span>
      </p>
    </div>
  );
}
