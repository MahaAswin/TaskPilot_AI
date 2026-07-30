// Abstract Base AI Provider Class

export class BaseProvider {
  constructor(config = {}) {
    if (new.target === BaseProvider) {
      throw new TypeError('Cannot construct BaseProvider instances directly');
    }
    this.name = config.name || 'BaseProvider';
    this.apiKey = config.apiKey || process.env[`${this.name.toUpperCase()}_API_KEY`] || '';
    this.baseUrl = config.baseUrl || '';
    this.timeout = config.timeout || 10000;
    this.maxTokens = config.maxTokens || 2048;
    this.temperature = config.temperature || 0.7;
    this.model = config.model || 'default';
  }

  async generateText(prompt, options = {}) {
    throw new Error('generateText() must be implemented by Provider subclass');
  }

  async generateStructuredResponse(prompt, schema = {}, options = {}) {
    const textResponse = await this.generateText(prompt, options);
    if (!textResponse) {
      throw new Error(`[${this.name}] Empty response returned for structured response request`);
    }
    if (typeof textResponse === 'object') {
      return textResponse;
    }
    const cleaned = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch (parseErr) {
      throw new Error(`[${this.name}] Failed to parse structured JSON response: ${parseErr.message}`);
    }
  }

  async generateImage(prompt, options = {}) {
    throw new Error('generateImage() must be implemented by Provider subclass');
  }

  async generateDiagram(prompt, options = {}) {
    throw new Error('generateDiagram() must be implemented by Provider subclass');
  }

  async generateMindMap(prompt, options = {}) {
    throw new Error('generateMindMap() must be implemented by Provider subclass');
  }

  async generateQuiz(topic, options = {}) {
    throw new Error('generateQuiz() must be implemented by Provider subclass');
  }

  async generateFlashcards(topic, options = {}) {
    throw new Error('generateFlashcards() must be implemented by Provider subclass');
  }

  async summarize(text, options = {}) {
    throw new Error('summarize() must be implemented by Provider subclass');
  }

  async explain(topic, options = {}) {
    throw new Error('explain() must be implemented by Provider subclass');
  }

  async chat(messages = [], options = {}) {
    throw new Error('chat() must be implemented by Provider subclass');
  }
}

export default BaseProvider;
