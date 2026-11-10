'use client';

import { CodeBlock } from '@repo/ui/ai/code-block';
import { Plan, type PlanStepStatus } from '@repo/ui/ai/plan';
import { Reasoning } from '@repo/ui/ai/reasoning';
import { Response } from '@repo/ui/ai/response';
import { Terminal } from '@repo/ui/ai/terminal';
import { Tool, type ToolStatus } from '@repo/ui/ai/tool';
import { Bubble } from '@repo/ui/components/bubble';
import { Message } from '@repo/ui/components/message';
import type { UIMessage } from 'ai';
import * as React from 'react';

type ToolPart = {
  type: `tool-${string}`;
  toolCallId: string;
  state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error' | string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

type PlanInput = { title?: string; steps?: Array<{ title?: string; status?: string }> };
type Diagnostic = { file: string; line?: number; rule: string; message: string };
type ChecksOutput = { ok: boolean; checked: number; diagnostics: Diagnostic[] };

function isToolPart(
  part: UIMessage['parts'][number],
): part is UIMessage['parts'][number] & ToolPart {
  return part.type.startsWith('tool-');
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function toolStatus(part: ToolPart): ToolStatus {
  if (part.state === 'output-error') return 'error';
  if (part.state === 'output-available')
    return record(part.output).ok === false ? 'error' : 'complete';
  return 'running';
}

function Paragraphs({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).filter((block) => block.trim());
  return (
    <>
      {blocks.map((block, index) => (
        <p key={index}>
          {block.split(/(`[^`]+`)/g).map((piece, pieceIndex) =>
            piece.startsWith('`') && piece.endsWith('`') && piece.length > 2 ? (
              <code
                key={pieceIndex}
                className="bg-muted rounded px-1 py-0.5 font-mono text-[0.85em]"
              >
                {piece.slice(1, -1)}
              </code>
            ) : (
              <React.Fragment key={pieceIndex}>{piece}</React.Fragment>
            ),
          )}
        </p>
      ))}
    </>
  );
}

const PLAN_STATUSES = new Set<PlanStepStatus>([
  'pending',
  'active',
  'complete',
  'skipped',
  'error',
]);

function PlanView({ input, streaming }: { input: PlanInput; streaming: boolean }) {
  const steps = (input.steps ?? []).filter((step) => step.title);
  const statusOf = (value: string | undefined): PlanStepStatus => {
    const status = (value ?? 'pending') as PlanStepStatus;
    if (!streaming && status === 'active') return 'complete';
    return PLAN_STATUSES.has(status) ? status : 'pending';
  };
  const completed = steps.filter((step) => statusOf(step.status) === 'complete').length;
  return (
    <Plan defaultOpen={streaming}>
      <Plan.Header title={input.title ?? 'Plan'} completed={completed} total={steps.length} />
      <Plan.Content>
        {steps.map((step, index) => (
          <Plan.Step key={index} status={statusOf(step.status)}>
            {step.title}
          </Plan.Step>
        ))}
      </Plan.Content>
    </Plan>
  );
}

function WriteFileView({ part }: { part: ToolPart }) {
  const input = record(part.input);
  const output = record(part.output);
  const status = toolStatus(part);
  const [open, setOpen] = React.useState(status === 'running');
  const [previous, setPrevious] = React.useState(status);

  if (status !== previous) {
    setPrevious(status);
    if (previous === 'running' && status === 'complete') setOpen(false);
    if (status === 'error') setOpen(true);
  }

  const path = typeof input.path === 'string' ? input.path : 'file';
  const content = typeof input.content === 'string' ? input.content : '';
  const lines =
    typeof output.lines === 'number' ? output.lines : content ? content.split('\n').length : 0;

  return (
    <Tool status={status} open={open} onOpenChange={setOpen}>
      <Tool.Header
        name="writeFile"
        description={status === 'complete' ? `${path} · ${lines} lines` : path}
      />
      <Tool.Content>
        {status === 'error' && typeof output.message === 'string' ? (
          <Tool.Output error label="Refused" value={output.message} />
        ) : null}
        {content ? (
          <CodeBlock code={content} language="tsx" collapsible maxLines={14}>
            <CodeBlock.CopyButton />
            <CodeBlock.Content label={path} />
            <CodeBlock.Expand />
          </CodeBlock>
        ) : null}
      </Tool.Content>
    </Tool>
  );
}

function ChecksView({ part }: { part: ToolPart }) {
  if (part.state !== 'output-available') {
    return (
      <Tool status={toolStatus(part)}>
        <Tool.Header name="runChecks" description="Types, imports and exports" />
      </Tool>
    );
  }
  const output = part.output as ChecksOutput;
  if (output.ok) {
    return (
      <Tool status="complete">
        <Tool.Header
          name="runChecks"
          description={`${output.checked} ${output.checked === 1 ? 'file' : 'files'}, no problems`}
        />
      </Tool>
    );
  }
  const lines = output.diagnostics
    .map((d) => `${d.file}${d.line ? `:${d.line}` : ''}  ${d.rule}  ${d.message}`)
    .join('\n');
  return (
    <Terminal command="runChecks" output={lines} exitCode={1}>
      <Terminal.Header exitLabel={() => `${output.diagnostics.length} to fix`} />
      <Terminal.Content label="Problems found by runChecks" />
    </Terminal>
  );
}

function describeTool(name: string, part: ToolPart): string | undefined {
  const input = record(part.input);
  const output = record(part.output);
  if (name === 'listComponents' && Array.isArray(output.components)) {
    return `${output.components.length} components in the catalog`;
  }
  if (name === 'getComponentCode' && typeof input.componentName === 'string')
    return input.componentName;
  if (name === 'searchKnowledgeBase' && typeof input.query === 'string') return input.query;
  if (typeof input.path === 'string') return input.path;
  return undefined;
}

function GenericToolView({ name, part }: { name: string; part: ToolPart }) {
  return (
    <Tool status={toolStatus(part)}>
      <Tool.Header name={name} description={describeTool(name, part)} />
      <Tool.Content>
        <Tool.Input value={part.input} />
        {part.state === 'output-error' ? (
          <Tool.Output error value={part.errorText ?? 'The tool failed.'} />
        ) : part.state === 'output-available' && name !== 'getComponentCode' ? (
          <Tool.Output value={part.output} />
        ) : null}
      </Tool.Content>
    </Tool>
  );
}

export function UserMessage({ message }: { message: UIMessage }) {
  const text = message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('\n')
    .trim();
  return (
    <Message align="end">
      <Message.Content className="max-w-[85%]">
        <Bubble variant="muted">
          <Bubble.Content className="whitespace-pre-wrap">{text}</Bubble.Content>
        </Bubble>
      </Message.Content>
    </Message>
  );
}

export function AssistantMessage({
  message,
  streaming,
}: {
  message: UIMessage;
  streaming: boolean;
}) {
  const parts = message.parts;
  const planIndexes = parts.flatMap((part, index) => (part.type === 'tool-setPlan' ? [index] : []));
  const firstPlan = planIndexes[0];
  const lastPlan = planIndexes.at(-1);
  const latestPlan = lastPlan === undefined ? undefined : (parts[lastPlan] as ToolPart | undefined);

  return (
    <div className="flex flex-col gap-2.5" data-role="assistant">
      {parts.map((part, index) => {
        const key = `${message.id}-${index}`;
        if (part.type === 'text') {
          if (!part.text.trim()) return null;
          return (
            <Response
              key={key}
              isStreaming={streaming && part.state === 'streaming'}
              className="text-sm"
            >
              <Paragraphs text={part.text} />
            </Response>
          );
        }
        if (part.type === 'reasoning') {
          if (!part.text.trim()) return null;
          return (
            <Reasoning key={key} isStreaming={streaming && part.state === 'streaming'}>
              <Reasoning.Trigger />
              <Reasoning.Content>
                <Paragraphs text={part.text} />
              </Reasoning.Content>
            </Reasoning>
          );
        }
        if (!isToolPart(part)) return null;
        const name = part.type.slice(5);
        if (name === 'setPlan') {
          if (index !== firstPlan || !latestPlan) return null;
          return (
            <PlanView
              key={key}
              input={record(latestPlan.input) as PlanInput}
              streaming={streaming}
            />
          );
        }
        if (name === 'writeFile') return <WriteFileView key={key} part={part} />;
        if (name === 'runChecks') return <ChecksView key={key} part={part} />;
        return <GenericToolView key={key} name={name} part={part} />;
      })}
    </div>
  );
}
