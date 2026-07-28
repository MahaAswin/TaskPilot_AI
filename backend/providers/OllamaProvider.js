import { BaseProvider } from './BaseProvider.js';

export class OllamaProvider extends BaseProvider {
  constructor(config = {}) {
    super({ 
      name: 'Ollama', 
      model: config.model || 'llama3:8b', 
      baseUrl: config.baseUrl || 'http://localhost:11434',
      ...config 
    });
  }

  async generateText(prompt, options = {}) {
    return `[Ollama Local Model Response (${this.model})] Output for: "${prompt}"`;
  }

  async generateStructuredResponse(prompt, schema = {}, options = {}) {
    return { provider: 'Ollama', model: this.model, prompt };
  }

  async generateImage(prompt, options = {}) {
    return { url: 'https://placehold.co/600x400/64748b/white?text=Ollama+Local+Image', prompt };
  }

  async generateDiagram(prompt, options = {}) {
    return `graph LR;\n  Ollama[Local ${this.model}] --> Flow[${prompt}];`;
  }

  async generateMindMap(prompt, options = {}) {
    return `# Ollama MindMap: ${prompt}\n- Local Model Output`;
  }

  async generateQuiz(topic, options = {}) {
    return [{ question: `Ollama question on ${topic}`, options: ['A', 'B'], answer: 0 }];
  }

  async generateFlashcards(topic, options = {}) {
    return [{ front: `Ollama Card: ${topic}`, back: `Local Memory Answer` }];
  }

  async summarize(text, options = {}) {
    return `[Ollama Local Summary]: ${text.slice(0, 100)}`;
  }

  async explain(topic, options = {}) {
    return `[Ollama Local Explanation]: Local offline explanation for ${topic}.`;
  }

  async chat(messages = [], options = {}) {
    return `[Ollama Local Chat]: Offline model response generated.`;
  }
}

export default OllamaProvider;
