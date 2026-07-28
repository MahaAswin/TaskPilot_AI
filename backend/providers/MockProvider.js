import { BaseProvider } from './BaseProvider.js';

export class MockProvider extends BaseProvider {
  constructor(config = {}) {
    super({ name: 'MockProvider', model: 'mock-v1', ...config });
  }

  async generateText(prompt, options = {}) {
    return `[MockProvider Response] Text generated for: "${prompt}"`;
  }

  async generateStructuredResponse(prompt, schema = {}, options = {}) {
    return { mock: true, prompt, schema };
  }

  async generateImage(prompt, options = {}) {
    return { url: 'https://placehold.co/600x400/indigo/white?text=Mock+AI+Image', prompt };
  }

  async generateDiagram(prompt, options = {}) {
    return `graph TD;\n  A[Start ${prompt}] --> B[Analyze Context];\n  B --> C[Generate Response];`;
  }

  async generateMindMap(prompt, options = {}) {
    return `# ${prompt}\n- Core Concepts\n  - Subtopic 1\n  - Subtopic 2`;
  }

  async generateQuiz(topic, options = {}) {
    return [
      { question: `Sample quiz question on ${topic}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 0 }
    ];
  }

  async generateFlashcards(topic, options = {}) {
    return [
      { front: `What is ${topic}?`, back: `Mock definition of ${topic}` }
    ];
  }

  async summarize(text, options = {}) {
    return `[Mock Summary]: ${text.slice(0, 100)}...`;
  }

  async explain(topic, options = {}) {
    return `[Mock Explanation]: Comprehensive explanation of ${topic}.`;
  }

  async chat(messages = [], options = {}) {
    const lastMsg = messages[messages.length - 1]?.content || 'Hello';
    return `[Mock AI Chat]: Responding to "${lastMsg}"`;
  }
}

export default MockProvider;
