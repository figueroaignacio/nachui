'use client';

import { Card } from '@repo/ui/components/card';
import { InputOTP } from '@repo/ui/components/input-otp';

export function PreviewVerifyEmail() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Verify your email</Card.Title>
        <Card.Description className="text-xs">We sent a code to lucia@acme.dev</Card.Description>
      </Card.Header>
      <Card.Content compact className="space-y-3">
        <InputOTP defaultValue="481" aria-label="Verification code">
          <InputOTP.Group>
            <InputOTP.Slot index={0} className="h-10 w-9 text-base" />
            <InputOTP.Slot index={1} className="h-10 w-9 text-base" />
            <InputOTP.Slot index={2} className="h-10 w-9 text-base" />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={3} className="h-10 w-9 text-base" />
            <InputOTP.Slot index={4} className="h-10 w-9 text-base" />
            <InputOTP.Slot index={5} className="h-10 w-9 text-base" />
          </InputOTP.Group>
        </InputOTP>
        <p className="text-muted-foreground text-[11px]">
          Did not get it? <span className="text-foreground font-medium">Resend in 0:24</span>
        </p>
      </Card.Content>
    </Card>
  );
}
