// AI Provider Integration Layer Types

export const SUPPORTED_PROVIDERS = [
  'Grok',
  'Gemini',
  'OpenAI',
  'Claude',
  'DeepSeek',
  'Mistral',
  'Ollama',
  'MockProvider'
];

export const AI_TASK_TYPES = {
  CHAT: 'chat',
  GENERATE: 'generate',
  SUMMARIZE: 'summarize',
  EXPLAIN: 'explain',
  IMAGE: 'image',
  DIAGRAM: 'diagram',
  MINDMAP: 'mindmap',
  QUIZ: 'quiz',
  FLASHCARDS: 'flashcards'
};

export default {
  SUPPORTED_PROVIDERS,
  AI_TASK_TYPES
};
