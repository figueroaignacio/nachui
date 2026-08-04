'use client';

import { ArrowDown01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Accordion } from '@repo/ui/components/accordion';
import { Avatar } from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';
import { Banner } from '@repo/ui/components/banner';
import { Breadcrumb } from '@repo/ui/components/breadcrumb';
import { Button } from '@repo/ui/components/button';
import { Callout } from '@repo/ui/components/callout';
import { Card } from '@repo/ui/components/card';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Collapsible } from '@repo/ui/components/collapsible';
import { Command } from '@repo/ui/components/command';
import { Files } from '@repo/ui/components/files';
import { Input } from '@repo/ui/components/input';
import { Kbd } from '@repo/ui/components/kbd';
import { Label } from '@repo/ui/components/label';
import { Progress } from '@repo/ui/components/progress';
import { Radio } from '@repo/ui/components/radio';
import { Select } from '@repo/ui/components/select';
import { Separator } from '@repo/ui/components/separator';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Spinner } from '@repo/ui/components/spinner';
import { Switch } from '@repo/ui/components/switch';
import { Table } from '@repo/ui/components/table';
import { Tabs } from '@repo/ui/components/tabs';
import { Typography } from '@repo/ui/components/typography';

// Placeholder text line, used only inside the static replicas of
// portal-based components (dialog, drawer, popover, dropdown, tooltip).
const MockBar = ({ className }: { className?: string }) => (
  <div className={`bg-muted-foreground/20 h-1.5 rounded-full ${className}`} />
);

const CloseGlyph = ({ size = 12 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/**
 * Compact previews for the components list, built from the real @repo/ui
 * primitives so they always reflect the current design. Components whose
 * open state lives in a portal (dialog, drawer, popover, dropdown-menu,
 * tooltip, toast) are shown as static replicas instead.
 */
export const COMPONENT_LIST_PREVIEWS: Record<string, React.ComponentType> = {
  accordion: () => (
    <Accordion type="single" defaultValue="one" className="w-[220px]">
      <Accordion.Item value="one">
        <Accordion.Trigger value="one">Is it accessible?</Accordion.Trigger>
        <Accordion.Content value="one">
          <p className="text-muted-foreground text-xs">
            Yes. It follows the WAI-ARIA disclosure pattern.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Trigger value="two">Is it styled?</Accordion.Trigger>
        <Accordion.Content value="two">
          <p className="text-muted-foreground text-xs">It matches your theme out of the box.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),

  avatar: () => (
    <div className="flex items-center -space-x-2">
      {['JD', 'AB', 'KL', 'MN'].map((initials, i) => (
        <Avatar key={initials} className="ring-background ring-2" style={{ zIndex: 4 - i }}>
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      ))}
    </div>
  ),

  badge: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),

  banner: () => (
    <div className="w-[240px]">
      <Banner variant="info">
        <Banner.Content>
          <Banner.Title>New release</Banner.Title>
          <Banner.Description>v2.0 is out now.</Banner.Description>
        </Banner.Content>
      </Banner>
    </div>
  ),

  breadcrumb: () => (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Page>Button</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  ),

  button: () => (
    <div className="flex items-center gap-2">
      <Button>Button</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),

  callout: () => (
    <div className="w-[240px]">
      <Callout variant="info">
        <Callout.Title>Good to know</Callout.Title>
        <Callout.Content>Every component ships with dark mode support.</Callout.Content>
      </Callout>
    </div>
  ),

  card: () => (
    <Card className="w-[220px]">
      <Card.Header compact>
        <Card.Title>Create project</Card.Title>
        <Card.Description>Deploy in one click.</Card.Description>
      </Card.Header>
      <Card.Footer compact className="justify-end gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Deploy</Button>
      </Card.Footer>
    </Card>
  ),

  checkbox: () => (
    <div className="space-y-3">
      {[
        { id: 'pv-terms', label: 'Accept terms', checked: true },
        { id: 'pv-emails', label: 'Send me updates', checked: false },
        { id: 'pv-remember', label: 'Remember me', checked: false },
      ].map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox id={item.id} defaultChecked={item.checked} />
          <Label htmlFor={item.id}>{item.label}</Label>
        </div>
      ))}
    </div>
  ),

  collapsible: () => (
    <div className="w-[220px]">
      <Collapsible variant="bordered" defaultOpen>
        <Collapsible.Trigger>
          <span className="text-sm font-medium">Starred repositories</span>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <p className="text-muted-foreground pt-2 text-xs">nachui/ui · nachui/cli · nachui/docs</p>
        </Collapsible.Content>
      </Collapsible>
    </div>
  ),

  command: () => (
    <div className="w-[240px]">
      <Command command="npx nachui add button" />
    </div>
  ),

  dialog: () => (
    <div className="bg-background border-border relative w-52 rounded-lg border p-5 shadow-lg">
      <div className="absolute top-4 right-4 opacity-40">
        <CloseGlyph />
      </div>
      <div className="mb-3 flex flex-col space-y-1.5">
        <MockBar className="bg-muted-foreground/55 h-2 w-28" />
        <MockBar className="mt-0.5 h-1 w-full opacity-30" />
        <MockBar className="h-1 w-4/5 opacity-25" />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Confirm</Button>
      </div>
    </div>
  ),

  'dropdown-menu': () => (
    <div className="flex flex-col items-start gap-1.5">
      <Button variant="outline">
        Options
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-muted-foreground/70" />
      </Button>
      <div className="bg-background border-border w-44 rounded-md border shadow-md">
        <div className="flex flex-col gap-0.5 p-1.5">
          <div className="text-muted-foreground px-3 py-1.5 text-[9px] font-semibold tracking-wider uppercase opacity-60">
            Actions
          </div>
          {[false, true, false].map((active, i) => (
            <div
              key={i}
              className={`flex items-center rounded-sm px-3 py-2 text-sm ${active ? 'bg-muted/60' : ''}`}
            >
              <MockBar className={`${active ? 'w-24 opacity-60' : 'w-20 opacity-30'}`} />
            </div>
          ))}
          <div className="bg-border/50 my-1 h-px" />
          <div className="text-destructive/60 flex items-center rounded-sm px-3 py-2 text-sm">
            <MockBar className="bg-destructive/40 w-16 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  ),

  drawer: () => (
    <div className="bg-background border-border relative h-36 w-52 overflow-hidden rounded-lg border shadow-2xl">
      <div className="pointer-events-none absolute inset-0 space-y-2 p-4 opacity-10">
        <MockBar className="w-full" />
        <MockBar className="w-5/6" />
        <MockBar className="w-4/6" />
      </div>
      <div className="bg-background border-border absolute inset-y-2 right-2 flex w-28 flex-col rounded-md border shadow-2xl">
        <div className="flex shrink-0 justify-center py-2.5">
          <div className="bg-muted-foreground/25 h-1 w-10 rounded-full" />
        </div>
        <div className="flex shrink-0 justify-end px-3 pb-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-full opacity-40">
            <CloseGlyph size={10} />
          </div>
        </div>
        <div className="flex-1 space-y-2 px-4 pb-4">
          <MockBar className="bg-muted-foreground/55 h-2 w-16" />
          <MockBar className="h-1 w-full opacity-25" />
          <div className="mt-1 space-y-1.5">
            <MockBar className="w-full opacity-20" />
            <MockBar className="w-4/5 opacity-15" />
          </div>
        </div>
      </div>
    </div>
  ),

  files: () => (
    <div className="w-[200px]">
      <Files defaultValue="src">
        <Files.Folder name="src">
          <Files.File name="button.tsx" status="modified" />
          <Files.File name="card.tsx" status="added" />
          <Files.File name="index.ts" />
        </Files.Folder>
        <Files.File name="package.json" />
      </Files>
    </div>
  ),

  input: () => (
    <div className="w-[210px] space-y-1.5">
      <Label htmlFor="pv-email">Email</Label>
      <Input id="pv-email" placeholder="you@example.com" readOnly />
    </div>
  ),

  kbd: () => (
    <div className="flex items-center gap-1.5">
      <Kbd>Ctrl</Kbd>
      <span className="text-muted-foreground/60 text-[10px]">+</span>
      <Kbd>K</Kbd>
    </div>
  ),

  label: () => (
    <div className="w-[210px] space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <Label htmlFor="pv-username">Username</Label>
          <span className="text-destructive/70 text-sm leading-none">*</span>
        </div>
        <Input id="pv-username" placeholder="nachui" readOnly />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Label htmlFor="pv-bio">Bio</Label>
          <span className="text-muted-foreground/50 text-[10px]">(optional)</span>
        </div>
        <Input id="pv-bio" placeholder="Tell us about you" readOnly />
      </div>
    </div>
  ),

  popover: () => (
    <div className="flex flex-col items-start gap-1.5">
      <Button variant="outline" size="sm">
        Open popover
      </Button>
      <div className="bg-popover border-border w-52 rounded-md border p-4 shadow-md">
        <div className="border-border/40 mb-3 border-b pb-2.5">
          <MockBar className="bg-muted-foreground/50 w-24" />
        </div>
        <div className="space-y-2">
          <MockBar className="w-full opacity-30" />
          <MockBar className="w-3/4 opacity-25" />
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            Skip
          </Button>
          <Button size="sm">Save</Button>
        </div>
      </div>
    </div>
  ),

  progress: () => (
    <div className="w-[200px] space-y-4">
      <div className="space-y-1.5">
        <div className="text-muted-foreground flex justify-between text-[10px] font-medium">
          <span>Uploading</span>
          <span>60%</span>
        </div>
        <Progress value={60} />
      </div>
      <div className="space-y-1.5">
        <div className="text-muted-foreground flex justify-between text-[10px] font-medium">
          <span>Processing</span>
          <span>80%</span>
        </div>
        <Progress value={80} />
      </div>
    </div>
  ),

  radio: () => (
    <div className="space-y-3">
      {[
        { label: 'Comfortable', checked: true },
        { label: 'Compact', checked: false },
        { label: 'Spacious', checked: false },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <Radio name="pv-density" aria-label={item.label} defaultChecked={item.checked} />
          <Label>{item.label}</Label>
        </div>
      ))}
    </div>
  ),

  select: () => (
    <div className="w-[200px] space-y-1.5">
      <Label htmlFor="pv-framework">Framework</Label>
      <Select id="pv-framework" defaultValue="next" aria-label="Framework">
        <option value="next">Next.js</option>
        <option value="astro">Astro</option>
        <option value="remix">Remix</option>
      </Select>
    </div>
  ),

  separator: () => (
    <div className="w-[210px] space-y-4">
      <div>
        <h4 className="text-sm font-medium">NachUI</h4>
        <p className="text-muted-foreground text-xs">An open-source component library.</p>
      </div>
      <Separator />
      <div className="flex h-4 items-center gap-3 text-xs">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Blog</span>
      </div>
    </div>
  ),

  skeleton: () => (
    <div className="w-[205px] space-y-3.5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-5/6" />
        <Skeleton className="h-2.5 w-4/6" />
      </div>
    </div>
  ),

  spinner: () => (
    <div className="flex items-end gap-6">
      <Spinner size="sm" variant="muted" />
      <Spinner size="md" variant="muted" />
      <Spinner size="lg" />
    </div>
  ),

  switch: () => (
    <div className="w-[190px] space-y-3">
      {[
        { id: 'pv-notif', label: 'Notifications', checked: true },
        { id: 'pv-marketing', label: 'Marketing emails', checked: false },
      ].map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <Label htmlFor={item.id}>{item.label}</Label>
          <Switch id={item.id} defaultChecked={item.checked} aria-label={item.label} />
        </div>
      ))}
    </div>
  ),

  table: () => (
    <div className="w-[230px]">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Amount</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[
            ['INV001', 'Paid', '$250'],
            ['INV002', 'Pending', '$150'],
            ['INV003', 'Paid', '$350'],
          ].map(([invoice, status, amount]) => (
            <Table.Row key={invoice}>
              <Table.Cell>{invoice}</Table.Cell>
              <Table.Cell>{status}</Table.Cell>
              <Table.Cell>{amount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ),

  tabs: () => (
    <div className="w-[220px]">
      <Tabs defaultValue="preview" size="sm">
        <Tabs.List>
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
          <Tabs.Trigger value="cli">CLI</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">
          <p className="text-muted-foreground pt-3 text-xs">
            See the component rendered with your theme.
          </p>
        </Tabs.Content>
      </Tabs>
    </div>
  ),

  toast: () => (
    <div className="bg-background border-success/20 text-success flex w-[215px] items-start gap-3 overflow-hidden rounded-md border p-4 shadow-lg">
      <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="mt-0.5 shrink-0" />
      <div className="flex w-full flex-col gap-1">
        <MockBar className="h-2 w-20 bg-current opacity-70" />
        <MockBar className="h-1 w-full bg-current opacity-30" />
      </div>
      <div className="mt-0.5 shrink-0 opacity-40">
        <CloseGlyph />
      </div>
    </div>
  ),

  tooltip: () => (
    <div className="flex flex-col items-center gap-0">
      <div className="bg-foreground/85 rounded-md px-3 py-1.5 shadow-md">
        <span className="text-background text-xs">Add to library</span>
      </div>
      <div
        className="bg-foreground/85 h-2 w-2"
        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
      />
      <div className="mt-2">
        <Button variant="outline" size="sm">
          Hover me
        </Button>
      </div>
    </div>
  ),

  typography: () => (
    <div className="w-[220px] space-y-2">
      <Typography variant="h3" className="font-heading text-lg font-semibold tracking-tight">
        The quick brown fox
      </Typography>
      <Typography variant="p" className="text-muted-foreground text-xs leading-relaxed">
        A complete set of heading, paragraph and list styles that adapt to your theme.
      </Typography>
    </div>
  ),
};
