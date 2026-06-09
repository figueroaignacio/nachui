'use client';

import type { ReactNode } from 'react';

import { Collapsible } from '../../components/collapsible';

const items: { title: string; content: ReactNode }[] = [
  {
    title: 'Prompt Engineering',
    content: (
      <div className="space-y-3 pt-3">
        <p className="text-muted-foreground text-sm">
          Prompt engineering is the practice of creating clear and effective instructions so an AI
          model understands exactly what you want. Common techniques include:
        </p>
        <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong>Few-shot:</strong> Providing examples to guide the model.
          </li>
          <li>
            <strong>Chain-of-thought:</strong> Asking the model to reason step by step.
          </li>
          <li>
            <strong>System prompts:</strong> Defining the assistant's role and behavior.
          </li>
          <li>
            <strong>Temperature:</strong> Adjusting creativity vs. precision.
          </li>
        </ul>
        <div className="pt-2">
          <code className="bg-secondary rounded px-2 py-1 text-xs">
            You are an expert assistant specialized in...
          </code>
        </div>
      </div>
    ),
  },
  {
    title: 'RAG (Retrieval-Augmented Generation)',
    content: (
      <div className="space-y-3 pt-3">
        <p className="text-muted-foreground text-sm">
          RAG combines a language model with an external knowledge base. The AI retrieves
          information from your documents and then generates an answer based on those sources.
        </p>
        <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
          <li>Reduces hallucinations by grounding answers in real data.</li>
          <li>Allows up-to-date information without retraining models.</li>
          <li>Perfect for documentation, support assistants, and intelligent search.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'AI SDKs & Model Providers',
    content: (
      <div className="space-y-3 pt-3">
        <p className="text-muted-foreground text-sm">
          AI SDKs make it easy to connect your application with large language models. They simplify
          authentication, requests, streaming, and model selection.
        </p>
        <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong>Groq:</strong> Extremely fast inference, ideal for real-time apps.
          </li>
          <li>
            <strong>OpenAI:</strong> Access to GPT models, embeddings, and multimodal features.
          </li>
          <li>
            <strong>Anthropic:</strong> Known for Claude models with strong reasoning and safety.
          </li>
          <li>
            <strong>Vercel AI SDK:</strong> A friendly layer for building chat and AI features in
            React and Next.js.
          </li>
        </ul>
        <p className="text-muted-foreground pt-2 text-xs">
          *Quick note:* These SDKs help developers focus on the product experience instead of
          handling low-level API details.
        </p>
      </div>
    ),
  },
];

export function Default() {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Collapsible key={item.title} variant="bordered" defaultOpen={index === 0}>
          <Collapsible.Trigger>
            <span className="text-lg font-semibold">{item.title}</span>
          </Collapsible.Trigger>
          <Collapsible.Content>{item.content}</Collapsible.Content>
        </Collapsible>
      ))}
    </div>
  );
}
