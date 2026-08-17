---
name: 'nachui-compound-components'
description: 'Use when building, extending, or consuming compound components, meaning components made of multiple sub-parts assembled via dot notation (e.g. Dialog.Trigger, Card.Header, Accordion.Item).'
---

# NachUI Compound Components

You are working with NachUI's compound component pattern. Every interactive component in `@repo/ui` uses this pattern. Learn it once, apply it everywhere.

## What Is a Compound Component?

A compound component is a single exported name that bundles multiple sub-components via `Object.assign`. Each sub-part is accessed via dot notation.

```tsx
// The export
const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: DialogClose,
});

// Usage — all parts live under one import
import { Dialog } from '@repo/ui/components/dialog';

<Dialog>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Confirm</Dialog.Title>
      <Dialog.Description>Are you sure?</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Dialog.Close>Cancel</Dialog.Close>
      <Button>Confirm</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>;
```

## Compound Component Map

| Component      | Sub-parts                                                                                       |
| :------------- | :---------------------------------------------------------------------------------------------- |
| `Accordion`    | `.Item` `.Trigger` `.Content`                                                                   |
| `Banner`       | `.Icon` `.Title` `.Description` `.Action`                                                       |
| `Breadcrumb`   | `.Item` `.Link` `.Separator` `.Ellipsis`                                                        |
| `Button`       | `.Group`                                                                                        |
| `Card`         | `.Header` `.Title` `.Description` `.Content` `.Footer`                                          |
| `Collapsible`  | `.Trigger` `.Content`                                                                           |
| `Dialog`       | `.Trigger` `.Content` `.Header` `.Title` `.Description` `.Footer` `.Close` `.Overlay` `.Portal` |
| `Drawer`       | `.Trigger` `.Content` `.Header` `.Title` `.Description` `.Footer` `.Close` `.Overlay` `.Portal` |
| `DropdownMenu` | `.Trigger` `.Content` `.Item` `.Separator` `.Label` `.Group`                                    |
| `Files`        | `.Tree` `.Item` `.Folder`                                                                       |
| `Popover`      | `.Trigger` `.Content` `.Arrow`                                                                  |
| `Steps`        | `.Item` `.Indicator` `.Content`                                                                 |
| `Tabs`         | `.List` `.Trigger` `.Content`                                                                   |
| `Toast`        | `.Title` `.Description` `.Action` `.Close`                                                      |
| `Tooltip`      | `.Trigger` `.Content` `.Arrow`                                                                  |

## Pattern: Context + Sub-components

Internally, compound components share state via React Context. The root component provides the context; sub-parts consume it.

```tsx
// 1. Define context
const AccordionContext = React.createContext<AccordionContextValue | null>(null);

// 2. Guard hook — throws if used outside provider
const useAccordionContext = () => {
  const context = React.use(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within an Accordion');
  return context;
};

// 3. Root provides context
const AccordionRoot = ({ children, type = 'single', ...props }) => {
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  // ...state logic

  return (
    <AccordionContext value={{ type, openItems, toggleItem }}>
      <div {...props}>{children}</div>
    </AccordionContext>
  );
};

// 4. Sub-part consumes context
const AccordionTrigger = ({ value, children }) => {
  const { openItems, toggleItem } = useAccordionContext();
  const isOpen = openItems.includes(value);
  // ...
};

// 5. Assemble and export
const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export { Accordion };
```

## Controlled vs Uncontrolled

All stateful compound components support both modes.

```tsx
// Uncontrolled — internal state, no props needed
<Accordion defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger value="item-1">Question</Accordion.Trigger>
    <Accordion.Content value="item-1">Answer</Accordion.Content>
  </Accordion.Item>
</Accordion>

// Controlled — you own the state
const [open, setOpen] = React.useState<string[]>([])

<Accordion value={open} onValueChange={setOpen}>
  ...
</Accordion>
```

## Usage Examples

### Card

```tsx
import { Card } from '@repo/ui/components/card';

<Card>
  <Card.Header>
    <Card.Title>Dashboard</Card.Title>
    <Card.Description>Overview of your metrics</Card.Description>
  </Card.Header>
  <Card.Content>
    {/* main content */}
  </Card.Content>
  <Card.Footer align="end">
    <Button variant="outline">Export</Button>
  </Card.Footer>
</Card>

// Variants: default | outline | ghost
// compact prop: reduces padding
<Card variant="outline">
  <Card.Header compact>
    <Card.Title>Compact Card</Card.Title>
  </Card.Header>
  <Card.Content compact>...</Card.Content>
</Card>
```

### Accordion

```tsx
import { Accordion } from '@repo/ui/components/accordion';

// Single open at a time (default)
<Accordion type="single" defaultValue="q1">
  <Accordion.Item value="q1">
    <Accordion.Trigger value="q1">What is NachUI?</Accordion.Trigger>
    <Accordion.Content value="q1">A component library for React.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="q2">
    <Accordion.Trigger value="q2">Is it open source?</Accordion.Trigger>
    <Accordion.Content value="q2">Yes.</Accordion.Content>
  </Accordion.Item>
</Accordion>

// Multiple open simultaneously
<Accordion type="multiple">
  ...
</Accordion>
```

### Tabs

```tsx
import { Tabs } from '@repo/ui/components/tabs';
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">
    <p>Overview content</p>
  </Tabs.Content>
  <Tabs.Content value="settings">
    <p>Settings content</p>
  </Tabs.Content>
</Tabs>;
```

### Dialog

```tsx
import { Dialog } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
<Dialog>
  <Dialog.Trigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete item</Dialog.Title>
      <Dialog.Description>This action cannot be undone.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button variant="outline">Cancel</Button>
      </Dialog.Close>
      <Button variant="destructive">Delete</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>;
```

### Tooltip

```tsx
import { Tooltip } from '@repo/ui/components/tooltip';
<Tooltip>
  <Tooltip.Trigger asChild>
    <Button variant="outline" size="icon">
      ?
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content>More information here.</Tooltip.Content>
</Tooltip>;
```

## Rules When Extending

1. **Never skip the root** — sub-parts thrown without their root will throw a runtime error from the context guard.
2. **Always set `displayName`** on every sub-component for React DevTools legibility.
3. **Hoist animation constants** to module level — never define `variants` objects inside component functions.
4. **Use `React.use(Context)`** (React 19 API), not `React.useContext(Context)` in new components.
5. **Preserve `asChild` pattern** on `Trigger` and `Close` sub-parts so consumers can swap the rendered element.
