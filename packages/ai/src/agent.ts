import { stepCountIs, ToolLoopAgent, type InferAgentUIMessage } from 'ai';
import { NACHUI_SYSTEM_PROMPT } from './prompts/system-prompt.js';
import { google, GOOGLE_MODELS } from './providers.js';
import { getComponentCodeTool } from './tools/get-component-code-tool.js';
import { searchKnowledgeBaseTool } from './tools/search-knowledge-base-tool.js';

export const nachUIAgent = new ToolLoopAgent({
  model: google(GOOGLE_MODELS.geminiFlash),
  instructions: NACHUI_SYSTEM_PROMPT,
  tools: {
    searchKnowledgeBase: searchKnowledgeBaseTool,
    getComponentCode: getComponentCodeTool,
  },
  onFinish: ({ steps, usage }) => {
    console.log(`Agent finished in ${steps.length} steps. Total tokens: ${usage?.totalTokens}`);
  },
  stopWhen: stepCountIs(10),
});

export type NachUIAgentUIMessage = InferAgentUIMessage<typeof nachUIAgent>;
