// AI Provider Integration Layer Mock Dataset

export const PROVIDERS_LIST = [
  { id: 'grok', name: 'Grok (xAI)', providerClass: 'GrokProvider', model: 'grok-beta', latency: '110ms', status: 'online', isDefault: true, priority: 1, icon: 'Zap' },
  { id: 'ollama', name: 'Ollama (Local)', providerClass: 'OllamaProvider', model: 'llama3:8b', latency: '45ms', status: 'online', isDefault: false, priority: 2, icon: 'HardDrive' },
  { id: 'openrouter', name: 'OpenRouter', providerClass: 'OpenRouterProvider', model: 'meta-llama/llama-3.1-8b-instruct:free', latency: '140ms', status: 'online', isDefault: false, priority: 3, icon: 'Globe' },
  { id: 'huggingface', name: 'HuggingFace', providerClass: 'HuggingFaceProvider', model: 'mistralai/Mistral-7B-Instruct-v0.2', latency: '170ms', status: 'online', isDefault: false, priority: 4, icon: 'Cpu' },
  { id: 'openai', name: 'OpenAI', providerClass: 'OpenAIProvider', model: 'gpt-4o', latency: '180ms', status: 'online', isDefault: false, priority: 5, icon: 'Cpu' },
  { id: 'claude', name: 'Claude', providerClass: 'ClaudeProvider', model: 'claude-3-5-sonnet', latency: '160ms', status: 'online', isDefault: false, priority: 6, icon: 'Brain' },
  { id: 'deepseek', name: 'DeepSeek', providerClass: 'DeepSeekProvider', model: 'deepseek-v3', latency: '210ms', status: 'online', isDefault: false, priority: 7, icon: 'Code' },
  { id: 'mistral', name: 'Mistral', providerClass: 'MistralProvider', model: 'mistral-large', latency: '190ms', status: 'online', isDefault: false, priority: 8, icon: 'Wind' },
  { id: 'mock', name: 'MockProvider', providerClass: 'MockProvider', model: 'mock-v1', latency: '5ms', status: 'online', isDefault: false, priority: 9, icon: 'Shield' }
];

export const PROMPT_TEMPLATES = [
  { id: 'tpl-1', title: 'System Architecture Diagram Generator', agent: 'Planner Agent', template: 'Act as a Senior Software Architect. Generate a Mermaid diagram for [Topic].' },
  { id: 'tpl-2', title: 'Granular Topic Summary', agent: 'Knowledge Agent', template: 'Summarize the core concepts of [Topic] with 3 key takeaways and 1 code snippet.' },
  { id: 'tpl-3', title: 'Interactive Quiz Builder', agent: 'Learning Agent', template: 'Create a 5-question multiple choice assessment on [Topic] with difficulty tags.' }
];

export const SAMPLE_UNIFIED_RESPONSE = {
  provider: 'Grok',
  agent: 'Coordinator Agent',
  tokens: 284,
  latency: '110ms',
  response: '### Unified Multi-Agent Synthesis\nTaskPilot AI orchestrated **Planner Agent** & **Knowledge Agent** using **Grok (xAI)** provider.\n\n```java\n// Sample Java Multithreading Pattern\npublic class TaskExecutor implements Runnable {\n    @Override\n    public void run() {\n        System.out.println("Orchestrated execution active");\n    }\n}\n```\n- System memory synced\n- RAG Knowledge Base indexed',
  citations: ['TaskPilot AI Internal RAG Index', 'Java Concurrency API Docs'],
  metadata: { model: 'grok-beta', fallbackTriggered: false },
  confidence: 0.98,
  timestamp: new Date().toISOString()
};

export default {
  PROVIDERS_LIST,
  PROMPT_TEMPLATES,
  SAMPLE_UNIFIED_RESPONSE
};
