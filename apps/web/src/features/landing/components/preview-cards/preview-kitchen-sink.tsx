'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Switch } from '@repo/ui/components/switch';
import { Textarea } from '@repo/ui/components/textarea';
import { ChevronDownIcon } from '@repo/ui/icons/chevron-down';

export function PreviewKitchenSink() {
  return (
    <Card>
      <Card.Content compact className="space-y-4 pt-4">
        <div className="flex gap-1.5">
          <Button size="sm">Button</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Project name</Label>
          <Input size="sm" defaultValue="acme-dashboard" aria-label="Project name" />
        </div>
        <Textarea
          aria-label="Message"
          placeholder="Tell us what you are building"
          className="min-h-16 text-xs"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <Badge>Stable</Badge>
            <Badge variant="warning">New</Badge>
            <Badge variant="outline">Beta</Badge>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox defaultChecked aria-label="Active" />
            <Switch defaultChecked aria-label="Compact mode" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button size="sm" variant="outline">
            Alert dialog
          </Button>
          <Button.Group attached>
            <Button size="sm" variant="outline">
              Copy
            </Button>
            <Button size="sm" variant="outline" className="px-2" aria-label="More options">
              <ChevronDownIcon size={14} />
            </Button>
          </Button.Group>
        </div>
      </Card.Content>
    </Card>
  );
}
