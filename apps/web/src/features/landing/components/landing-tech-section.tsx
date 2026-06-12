import {
  MotionIcon,
  NextJSIcon,
  ReactIcon,
  TailwindIcon,
  TypescriptIcon,
} from '@/components/common/tech-icons';
import { Container } from '@repo/ui/layout/container';
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
    <section className="border-border/50 w-full border-y py-10 sm:py-14">
      <Container size="xl">
        <p className="text-muted-foreground mb-8 px-4 text-xs font-semibold tracking-widest uppercase sm:px-0">
          {t('title')}
        </p>

        {/* Tech logos row — wraps on small screens */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 px-4 sm:gap-x-12 sm:px-0">
          {technologies.map((tech) => (
            <div key={tech.name} className="text-muted-foreground/70 flex items-center gap-2.5">
              <div className="h-5 w-5 shrink-0">{techIconMap[tech.name]}</div>
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
