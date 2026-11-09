'use client';

import * as React from 'react';
import { InputOTP } from '../../components/input-otp';
import { Label } from '../../components/label';

export function Alphanumeric() {
  const [code, setCode] = React.useState('');

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="invite-code">Invite code</Label>
      <InputOTP
        id="invite-code"
        pattern="alphanumeric"
        value={code}
        onValueChange={(next) => setCode(next.toUpperCase())}
        aria-describedby="invite-code-hint"
      >
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
      <p id="invite-code-hint" className="text-muted-foreground text-xs">
        It is in the invite email from your workspace admin, like K7P-Q2X.
      </p>
    </div>
  );
}
