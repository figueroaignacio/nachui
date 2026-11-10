'use client';

import { Confirmation } from '../../ai/confirmation';

export function Default() {
  return (
    <div className="w-full max-w-md">
      <Confirmation>
        <Confirmation.Title>Send the weekly report to the whole team?</Confirmation.Title>
        <Confirmation.Description>
          It goes to 14 people from reports@northwind.io.
        </Confirmation.Description>
        <Confirmation.Actions>
          <Confirmation.Deny />
          <Confirmation.Approve>Send report</Confirmation.Approve>
        </Confirmation.Actions>
      </Confirmation>
    </div>
  );
}
