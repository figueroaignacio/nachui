import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';

export function PreviewUpgrade() {
  return (
    <Card variant="outline" className="bg-card rounded-lg backdrop-blur-sm">
      <Card.Content compact className="flex items-center justify-between p-4 px-5">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div>
            <div className="text-foreground text-sm font-bold">You have 2 credits left</div>
            <div className="text-muted-foreground mt-0.5 text-xs">
              Get a paid plan for more credits
            </div>
          </div>
        </div>
        <Button variant="secondary" size="sm" className="rounded-full">
          Upgrade
        </Button>
      </Card.Content>
    </Card>
  );
}
