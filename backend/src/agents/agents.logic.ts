import { Agent, tool, setDefaultOpenAIClient } from '@openai/agents';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

setDefaultOpenAIClient(groqClient);

// --- 🛠 TOOLS ---

export const getDocumentContent = tool({
  name: 'get_document_content',
  description: 'Retrieve the text content of the uploaded PDF.',
  parameters: { 
    type: 'object', 
    properties: {}, 
    required: [], 
    additionalProperties: false 
  },
  execute: async () => {
    return { content: (global as any).extractedText || "No document content found." };
  },
});

export const countWords = tool({
  name: 'count_document_words',
  description: 'Get the word count of the document.',
  parameters: { 
    type: 'object', 
    properties: {}, 
    required: [], 
    additionalProperties: false 
  },
  execute: async () => {
    const text = (global as any).extractedText || "";
    const count = text.split(/\s+/).filter(w => w.length > 0).length;
    return { wordCount: count };
  },
});

// --- 🧠 SPECIALIST AGENTS ---

export const analystAgent = new Agent({
  name: 'Document_Analyst',
  handoffDescription: 'Use for identifying document type and structure.',
  instructions: 'You are an Analyst. Use get_document_content to identify the document type.',
  model: 'llama-3.1-8b-instant',
  tools: [getDocumentContent],
});

export const summaryAgent = new Agent({
  name: 'Summarizer',
  handoffDescription: 'Use for overviews or when the user asks "what is this about".',
  instructions: `
    You are a professional Document Analyst. 
    1. You MUST call 'get_document_content' before doing anything else.
    2. If 'get_document_content' returns "No content", DO NOT proceed. 
    3. Once you have the text, provide a 3-4 sentence detailed summary of the main topics.
    4. ONLY after the summary, mention the word count.
  `,
  model: 'llama-3.1-8b-instant',
  tools: [getDocumentContent, countWords],
});
export const qaAgent = new Agent({
  name: 'QA_Specialist',
  handoffDescription: 'Use for answering specific questions about data inside the document.',
  instructions: 'You are a QA Specialist. Use get_document_content to answer questions strictly from the text.',
  model: 'llama-3.1-8b-instant',
  tools: [getDocumentContent],
});

// --- 🚦 ROUTER AGENT ---

export const routerAgent = new Agent({
  name: 'Router',
  instructions: `
    You are an efficient Assistant. 
    Your ONLY goal is to hand off to the right specialist as fast as possible.
    If the user input is nonsense, ignore it and hand off to the Analyst to ask for clarification.
  `,
  model: 'llama-3.1-8b-instant',
  handoffs: [analystAgent, summaryAgent, qaAgent],
});

// --- 🛡 GUARDRAILS (The "Get Out" Logic) ---

export const applyGuardrails = (input: string): string | null => {
  const cleanInput = input.trim().toLowerCase();

  // 1. Block random number strings
  if (/^\d{5,}$/.test(cleanInput)) {
    return "This is just a string of numbers. Please ask a real question or leave.";
  }

  // 2. Block Keyboard Smashing (Gibberish)
  const gibberishRegex = /(.)\1{4,}|[bcdfghjklmnpqrstvwxyz]{6,}/i; 
  if (gibberishRegex.test(cleanInput)) {
    return "Invalid input detected. Stop smashing your keyboard and ask something relevant.";
  }

  // 3. Block "Stupid" / Low Effort prompts
  const stupidPrompts = ['hi', 'hello', 'test', 'blah', 'stuff', 'ok', 'bye'];
  if (cleanInput.length < 4 || stupidPrompts.includes(cleanInput)) {
    return "This request is too vague or unprofessional. Provide a clear instruction or exit.";
  }

  return null; 
};