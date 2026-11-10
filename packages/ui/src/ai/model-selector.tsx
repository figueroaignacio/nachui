'use client';

import * as React from 'react';
import { Select } from '../components/select';
import { cn } from '../lib/cn';

type ModelSelectorProps = React.ComponentProps<typeof Select>;

type ModelSelectorTriggerProps = React.ComponentProps<typeof Select.Trigger>;

const ModelSelectorRoot = ({ className, ...props }: ModelSelectorProps) => (
  <Select className={cn('w-auto', className)} {...props} />
);

ModelSelectorRoot.displayName = 'ModelSelector';

const ModelSelectorTrigger = ({ className, size = 'sm', ...props }: ModelSelectorTriggerProps) => (
  <Select.Trigger
    size={size}
    data-slot="model-selector-trigger"
    className={cn(
      'text-muted-strong hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground w-auto gap-1.5 border-transparent bg-transparent px-2 dark:bg-transparent',
      className,
    )}
    {...props}
  />
);

ModelSelectorTrigger.displayName = 'ModelSelectorTrigger';

type ModelSelectorContentProps = React.ComponentProps<typeof Select.Content>;

const ModelSelectorContent = ({ className, ...props }: ModelSelectorContentProps) => (
  <Select.Content className={cn('min-w-72', className)} {...props} />
);

ModelSelectorContent.displayName = 'ModelSelectorContent';

interface ModelSelectorItemProps extends Omit<
  React.ComponentProps<typeof Select.Item>,
  'textValue' | 'children'
> {
  children: string;
  description?: React.ReactNode;
  badge?: React.ReactNode;
}

const ModelSelectorItem = ({ children, description, badge, ...props }: ModelSelectorItemProps) => (
  <Select.Item textValue={children} {...props}>
    <span data-slot="model-selector-item" className="flex min-w-0 flex-col gap-0.5 py-0.5">
      <span className="flex items-center gap-2">
        <span className="truncate font-medium">{children}</span>
        {badge ? (
          <span className="bg-secondary text-muted-foreground rounded-sm px-1.5 py-px text-[11px] font-medium">
            {badge}
          </span>
        ) : null}
      </span>
      {description ? (
        <span className="text-muted-foreground truncate text-xs">{description}</span>
      ) : null}
    </span>
  </Select.Item>
);

ModelSelectorItem.displayName = 'ModelSelectorItem';

const ModelSelector = Object.assign(ModelSelectorRoot, {
  Trigger: ModelSelectorTrigger,
  Content: ModelSelectorContent,
  Item: ModelSelectorItem,
  Group: Select.Group,
  Label: Select.Label,
  Separator: Select.Separator,
});

export { ModelSelector };
export type {
  ModelSelectorContentProps,
  ModelSelectorItemProps,
  ModelSelectorProps,
  ModelSelectorTriggerProps,
};
