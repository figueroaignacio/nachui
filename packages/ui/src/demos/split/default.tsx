import { Split } from '../../layout/split';

const links = ['General', 'Members', 'Billing', 'Integrations', 'Danger zone'];

export function Default() {
  return (
    <Split
      ratio="1/3"
      collapse="sm"
      className="border-border bg-card w-full max-w-lg rounded-xl border p-4"
    >
      <nav className="flex flex-col gap-1">
        {links.map((link, index) => (
          <a
            key={link}
            href="#"
            className={
              index === 0
                ? 'bg-muted rounded-md px-3 py-1.5 text-sm font-medium'
                : 'text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm'
            }
          >
            {link}
          </a>
        ))}
      </nav>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">General</p>
        <p className="text-muted-foreground text-sm">
          Workspace name, default region and the timezone used for reports.
        </p>
      </div>
    </Split>
  );
}
