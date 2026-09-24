'use client';

import { AgentRun, type AgentStep } from '../../hybrids/agent-run';

const STEPS: AgentStep[] = [
  {
    id: 'read',
    title: 'Read the auth module',
    status: 'complete',
    detail: 'Scanned 12 files and the three tests that cover them',
    files: ['auth.service.ts', 'session-store.ts', 'token-store.ts'],
  },
  {
    id: 'plan',
    title: 'Plan the refactor',
    status: 'complete',
    reasoning:
      'The session store and the token store read the same cookie and expose the same three methods. One interface with two adapters removes the duplicated parsing and keeps both call sites untouched.',
  },
  {
    id: 'write',
    title: 'Rewrite the session store',
    status: 'complete',
    tools: [
      {
        id: 'read-file',
        name: 'read_file',
        status: 'complete',
        description: 'Reads a file from the workspace',
        input: { path: 'src/auth/session-store.ts' },
        output: { lines: 84, exports: ['SessionStore', 'createSessionStore'] },
      },
      {
        id: 'write-file',
        name: 'write_file',
        status: 'complete',
        description: 'Writes a file to the workspace',
        input: { path: 'src/auth/session-store.ts', bytes: 2210 },
        output: 'ok',
      },
    ],
    files: ['session-store.ts'],
  },
  {
    id: 'test',
    title: 'Run the tests',
    status: 'complete',
    detail: '3 files, 14 tests, all green',
  },
];

const STARTED = new Date('2026-09-22T10:00:00Z');
const FINISHED = new Date('2026-09-22T10:01:42Z');

export function Default() {
  return (
    <div className="w-full max-w-xl">
      <AgentRun
        title="Refactoring the auth module"
        status="complete"
        steps={STEPS}
        startedAt={STARTED}
        finishedAt={FINISHED}
        usage={{ used: 38400, max: 200000 }}
        answer={
          <>
            <p>
              The session and token stores now share one <code>CookieStore</code> interface. Both
              adapters live next to it, the parsing happens once, and every call site compiles
              unchanged.
            </p>
            <p>Tests pass. Nothing else in the module needed touching.</p>
          </>
        }
      />
    </div>
  );
}
