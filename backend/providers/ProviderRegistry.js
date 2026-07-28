import { MockProvider } from './MockProvider.js';
import { GrokProvider } from './GrokProvider.js';
import { GeminiProvider } from './GeminiProvider.js';
import { OpenAIProvider } from './OpenAIProvider.js';
import { ClaudeProvider } from './ClaudeProvider.js';
import { DeepSeekProvider } from './DeepSeekProvider.js';
import { MistralProvider } from './MistralProvider.js';
import { OllamaProvider } from './OllamaProvider.js';

export const PROVIDER_CLASSES = {
  mock: MockProvider,
  grok: GrokProvider,
  gemini: GeminiProvider,
  openai: OpenAIProvider,
  claude: ClaudeProvider,
  deepseek: DeepSeekProvider,
  mistral: MistralProvider,
  ollama: OllamaProvider
};

export class ProviderRegistry {
  static getProviderInstance(name = 'mock', config = {}) {
    const ProviderClass = PROVIDER_CLASSES[name.toLowerCase()] || MockProvider;
    return new ProviderClass(config);
  }
}

export default ProviderRegistry;
