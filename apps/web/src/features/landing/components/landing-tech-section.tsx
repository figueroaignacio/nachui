import {
  MotionIcon,
  NextJSIcon,
  ReactIcon,
  TailwindIcon,
  TypescriptIcon,
} from '@/components/common/tech-icons';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Technology {
  name: string;
  description: string;
}

const techIconMap: Record<string, React.ReactNode> = {
  TypeScript: <TypescriptIcon />,
  React: <ReactIcon />,
  'Next.js': <NextJSIcon />,
  'Tailwind CSS': <TailwindIcon />,
  Motion: <MotionIcon />,
};

export function LandingTechSection() {
  const t = useTranslations('sections.home.tech');
  const technologies = t.raw('technologies') as Technology[];

  return (
    <section className="w-full py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* Section label */}
        <div className="mb-8">
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
            {t('title')}
          </p>
          <div className="bg-rule mt-3 h-px" />
        </div>

        {/* Tech logos row */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {technologies.map((tech) => (
            <div key={tech.name} className="text-muted-foreground/70 flex items-center gap-2">
              <div className="h-4 w-4 shrink-0">{techIconMap[tech.name]}</div>
              <span className="font-mono text-[13px]">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
