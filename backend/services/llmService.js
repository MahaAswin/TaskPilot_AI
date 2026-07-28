import axios from 'axios';

class LLMService {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
    this.useFallback = !this.apiKey;
    
    if (this.useFallback) {
      console.log('[LLM Service] No GROK_API_KEY found. Using Pollinations AI keyless API fallback.');
    } else {
      console.log('[LLM Service] GROK_API_KEY loaded. Operating in Grok AI mode.');
    }
  }

  /**
   * Send a chat completion request.
   * @param {Array} messages - Chat history in OpenAI format [{role, content}]
   * @param {Number} temperature - Temperature configuration
   * @returns {Promise<string>} Content string response from LLM
   */
  async generateCompletion(messages, temperature = 0.7) {
    if (this.useFallback) {
      return this._callPollinationsAI(messages);
    } else {
      return this._callGrokAPI(messages, temperature);
    }
  }

  /**
   * Internal Grok call
   */
  async _callGrokAPI(messages, temperature) {
    try {
      const response = await axios.post(
        'https://api.x.ai/v1/chat/completions',
        {
          model: 'grok-beta',
          messages,
          temperature,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 25000,
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(`[LLM Service] Grok API Error: ${error.response?.data?.error?.message || error.message}`);
      console.log('[LLM Service] Swapping to fallback Pollinations AI API due to Grok failure...');
      return this._callPollinationsAI(messages);
    }
  }

  /**
   * Internal keyless fallback using Pollinations AI Text model
   */
  async _callPollinationsAI(messages) {
    try {
      // Pollinations AI text endpoint is simple: we format the conversation context
      // and append a system instruction at the top.
      const formattedMessages = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await axios.post(
        'https://text.pollinations.ai/',
        {
          messages: formattedMessages,
          model: 'openai', // default model on pollinations
          private: true
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 25000
        }
      );

      // Pollinations response is direct text or standard OpenAI format depending on payload.
      // Usually, when posting JSON to text.pollinations.ai, it returns the text directly or a JSON object.
      // If it's a string, we return it. If it's JSON with choices, we parse it.
      if (typeof response.data === 'string') {
        return response.data;
      } else if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      } else if (response.data?.content) {
        return response.data.content;
      }
      
      return JSON.stringify(response.data);
    } catch (error) {
      console.error(`[LLM Service] Fallback API Error: ${error.message}`);
      return this._getHeuristicStaticResponse(messages);
    }
  }

  /**
   * Ultra fallback in case of absolute offline or api outage
   */
  _getHeuristicStaticResponse(messages) {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    if (lastMessage.includes('task') || lastMessage.includes('todo')) {
      return `{"reasoning": "User wants to manage tasks. Invoking TaskAgent.", "selectedAgents": ["TaskAgent"]}`;
    }
    if (lastMessage.includes('roadmap') || lastMessage.includes('plan') || lastMessage.includes('study')) {
      return `{"reasoning": "User requests timeline planning. Invoking PlannerAgent.", "selectedAgents": ["PlannerAgent"]}`;
    }
    if (lastMessage.includes('image') || lastMessage.includes('draw') || lastMessage.includes('diagram')) {
      return `{"reasoning": "User requests graphic generation. Invoking CreativeAgent.", "selectedAgents": ["CreativeAgent"]}`;
    }
    
    return `{"reasoning": "General chat query. Invoking KnowledgeAgent.", "selectedAgents": ["KnowledgeAgent"]}`;
  }
}

export default new LLMService();
