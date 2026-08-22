'use client';

import { Accordion } from '../../components/accordion';

const faq = [
  {
    value: 'seats',
    question: 'How are seats billed?',
    answer:
      'Every teammate you invite takes a seat. New seats are prorated for the days left in the billing period, and seats you remove come back as credit on the next invoice.',
  },
  {
    value: 'plan-change',
    question: 'Can I switch plans in the middle of a cycle?',
    answer:
      'Yes. Upgrades apply right away and you pay the difference for the rest of the month. Downgrades take effect on the renewal date so you keep what you already paid for.',
  },
  {
    value: 'invoices',
    question: 'Where do I find past invoices?',
    answer:
      'Open Settings, then Billing. Every invoice is there as a PDF, and the billing contact gets a copy by email within a few minutes of each charge.',
  },
  {
    value: 'overage',
    question: 'What happens if we go over the included usage?',
    answer:
      'We keep serving traffic and add the extra usage to your next invoice at the rate listed on your plan. You get an email as soon as you pass 80% of the included quota.',
  },
];

export function Default() {
  return (
    <Accordion type="single" className="w-full max-w-md" defaultValue="seats">
      {faq.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Trigger value={item.value}>{item.question}</Accordion.Trigger>
          <Accordion.Content value={item.value} className="text-muted-foreground text-sm">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
