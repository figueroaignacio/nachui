'use client';

import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Tabs } from '../../components/tabs';

const tabsData = [
  {
    value: 'overview',
    label: 'Overview',
    title: 'AI Overview',
    description:
      'Understand the current landscape of artificial intelligence, trends, and applications across industries.',
    actions: (
      <div className="flex gap-3">
        <Button onClick={() => alert('Viewing AI trends')} variant="secondary">
          View Trends
        </Button>
        <Button variant="ghost" onClick={() => alert('Explore applications')}>
          Explore Applications
        </Button>
      </div>
    ),
  },
  {
    value: 'models',
    label: 'Models',
    title: 'AI Models',
    description:
      'Track the performance of different AI models, from NLP and computer vision to reinforcement learning systems.',
    actions: (
      <Button onClick={() => alert('Opening model library')} variant="secondary">
        View Models
      </Button>
    ),
  },
  {
    value: 'research',
    label: 'Research',
    title: 'Research & Publications',
    description:
      'Stay up-to-date with the latest research papers, case studies, and breakthroughs in AI technology.',
    actions: (
      <Button onClick={() => alert('Browsing research papers')} variant="secondary">
        Browse Research
      </Button>
    ),
  },
  {
    value: 'ethics',
    label: 'Ethics',
    title: 'Ethics & Governance',
    description:
      'Understand ethical considerations, regulations, and best practices for responsible AI deployment.',
    actions: (
      <div className="flex gap-3">
        <Button onClick={() => alert('View guidelines')} variant="secondary">
          View Guidelines
        </Button>
        <Button variant="ghost" onClick={() => alert('Report concerns')}>
          Report Concerns
        </Button>
      </div>
    ),
  },
];

export function Default() {
  return (
    <Tabs defaultValue="overview" variant="default" size="sm">
      <Tabs.List>
        {tabsData.map((tab) => (
          <Tabs.Trigger key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabsData.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value}>
          <Card className="border-border shadow-sm">
            <Card.Header>
              <Card.Title>{tab.title}</Card.Title>
              <Card.Description>{tab.description}</Card.Description>
            </Card.Header>
            <Card.Content>{tab.actions}</Card.Content>
          </Card>
        </Tabs.Content>
      ))}
    </Tabs>
  );
}
