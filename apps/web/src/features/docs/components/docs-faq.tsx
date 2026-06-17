'use client';

import { Accordion } from '@repo/ui/components/accordion';
import { Stack } from '@repo/ui/layout/stack';
import { useTranslations } from 'next-intl';

interface FaqItem {
  question: string;
  answer: string;
}

export function DocsFaq() {
  const t = useTranslations('sections.faq');
  const items: FaqItem[] = t.raw('items');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="bg-background relative z-10 w-full pt-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Stack gap="12">
        <div>
          <Accordion type="single" className="w-full">
            {items.map((item, idx) => (
              <Accordion.Item key={idx} value={`item-${idx}`}>
                <Accordion.Trigger value={`item-${idx}`}>{item.question}</Accordion.Trigger>
                <Accordion.Content value={`item-${idx}`}>{item.answer}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </Stack>
    </section>
  );
}
