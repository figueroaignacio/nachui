'use client';

import { Confirmation } from '../../ai/confirmation';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function Async() {
  return (
    <div className="w-full max-w-md">
      <Confirmation approvedLabel="Merged into main" deniedLabel="Left open for review">
        <Confirmation.Title>Merge pull request #482 into main?</Confirmation.Title>
        <Confirmation.Description>
          All 13 checks passed. The branch is up to date.
        </Confirmation.Description>
        <Confirmation.Actions>
          <Confirmation.Deny>Not now</Confirmation.Deny>
          <Confirmation.Approve onClick={() => wait(1200)}>Merge</Confirmation.Approve>
        </Confirmation.Actions>
      </Confirmation>
    </div>
  );
}
