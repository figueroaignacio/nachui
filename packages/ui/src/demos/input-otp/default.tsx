'use client';

import { InputOTP } from '../../components/input-otp';
import { Label } from '../../components/label';

export function Default() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="verification-code">Verification code</Label>
      <InputOTP id="verification-code" aria-describedby="verification-code-hint">
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>
      <p id="verification-code-hint" className="text-muted-foreground text-xs">
        We sent a 6 digit code to ana@northwind.io.
      </p>
    </div>
  );
}
