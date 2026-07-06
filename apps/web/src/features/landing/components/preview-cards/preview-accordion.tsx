import { Accordion } from '@repo/ui/components/accordion';

export function PreviewAccordion() {
  return (
    <div
      className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5"
      role="region"
      aria-label="Frequently asked questions accordion"
    >
      <span className="mb-1 text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
        Common Questions
      </span>
      <Accordion type="single" defaultValue="item-1">
        <Accordion.Item value="item-1" className="border-zinc-100 dark:border-zinc-900/50">
          <Accordion.Trigger
            value="item-1"
            className="hover:text-primary cursor-pointer py-2.5 text-xs font-semibold text-zinc-900 transition-colors dark:text-zinc-50"
          >
            What is NachUI?
          </Accordion.Trigger>
          <Accordion.Content
            value="item-1"
            className="pb-3 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400"
          >
            A premium React component library built with Tailwind CSS v4 and Framer Motion. Built
            for visual excellence.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2" className="border-none">
          <Accordion.Trigger
            value="item-2"
            className="hover:text-primary cursor-pointer py-2.5 text-xs font-semibold text-zinc-900 transition-colors dark:text-zinc-50"
          >
            Is it production ready?
          </Accordion.Trigger>
          <Accordion.Content
            value="item-2"
            className="pb-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400"
          >
            Absolutely. Built on top of strict TypeScript presets and comprehensive unit tests with
            Vitest.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
