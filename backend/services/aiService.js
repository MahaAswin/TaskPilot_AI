import { globalProviderManager } from '../providers/ProviderManager.js';

export class AIService {
  async chat(messages, options = {}) {
    const prompt = Array.isArray(messages)
      ? messages.map(m => typeof m === 'string' ? m : (m.content || m.text || '')).join('\n')
      : String(messages || '');

    return await globalProviderManager.executeMethod('chat', prompt, options);
  }
}

export const aiService = new AIService();
export default aiService;
