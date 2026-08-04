import { Breadcrumb } from '@repo/ui/components/breadcrumb';
import { Card } from '@repo/ui/components/card';

const actions = [
  {
    title: 'Change transfer limit',
    description: 'Adjust how much you can send from your balance.',
  },
  {
    title: 'Scheduled transfers',
    description: 'Set up a transfer to send at a later date.',
  },
  {
    title: 'Recurring card payments',
    description: 'Manage your repeated card transactions.',
  },
];

export function PreviewPaymentsNav() {
  return (
    <Card>
      <Card.Header compact>
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Ellipsis />
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Payments</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-2">
        {actions.map((action) => (
          <div
            key={action.title}
            className="border-border flex items-center justify-between gap-2 rounded-md border p-3"
          >
            <div>
              <div className="text-foreground text-xs font-semibold">{action.title}</div>
              <div className="text-muted-foreground mt-0.5 text-[11px]">{action.description}</div>
            </div>
            <span className="text-muted-foreground text-xs" aria-hidden="true">
              ›
            </span>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
