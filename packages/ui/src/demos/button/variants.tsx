import { Button, type ButtonProps } from '../../components/button';
import { cn } from '../../lib/cn';
import { Flex } from '../../layout/flex';

const settings: {
  title: string;
  detail: string;
  action: string;
  variant: NonNullable<ButtonProps['variant']>;
}[] = [
  {
    title: 'Profile',
    detail: 'Name, avatar and timezone',
    action: 'Save changes',
    variant: 'default',
  },
  {
    title: 'Team',
    detail: '7 of 10 seats used',
    action: 'Invite teammate',
    variant: 'secondary',
  },
  {
    title: 'Data export',
    detail: 'Every invoice as a CSV file',
    action: 'Export',
    variant: 'outline',
  },
  {
    title: 'Weekly digest',
    detail: 'Sent to nadia@acmestudio.dev',
    action: 'Turn off',
    variant: 'ghost',
  },
  {
    title: 'Changelog',
    detail: 'Shipped 2.4.0 on Mar 14',
    action: 'Read release notes',
    variant: 'link',
  },
  {
    title: 'Danger zone',
    detail: 'Deleting a workspace is permanent',
    action: 'Delete workspace',
    variant: 'destructive',
  },
];

export function Variants() {
  return (
    <div className="border-border bg-card divide-border w-full max-w-md divide-y rounded-xl border">
      {settings.map((setting) => (
        <Flex key={setting.title} align="center" justify="between" gap="4" className="p-4">
          <div className="min-w-0">
            <p
              className={cn(
                'truncate text-sm font-medium',
                setting.variant === 'destructive' && 'text-destructive-text',
              )}
            >
              {setting.title}
            </p>
            <p className="text-muted-foreground truncate text-xs">{setting.detail}</p>
          </div>
          <Button variant={setting.variant} size="sm">
            {setting.action}
          </Button>
        </Flex>
      ))}
    </div>
  );
}
