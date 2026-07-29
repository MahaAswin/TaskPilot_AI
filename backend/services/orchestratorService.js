// Topic-to-Image Pipeline Orchestrator Service
import ProviderManager from '../providers/ProviderManager.js';

export const orchestratorService = {
  /**
   * Generates 5 to 6 core keywords and visual image pipeline for a given topic.
   * @param {string} topic - User specified topic name (e.g., "Quantum Computing")
   * @returns {Promise<{
   *   topic: string,
   *   summary: string,
   *   totalSteps: number,
   *   keywords: Array<{
   *     step: number,
   *     keyword: string,
   *     subtitle: string,
   *     description: string,
   *     imagePrompt: string,
   *     imageUrl: string,
   *     colorTheme: string
   *   }>
   * }>}
   */
  generateTopicPipeline: async (topic) => {
    const cleanTopic = (topic || 'Machine Learning Pipeline').trim();

    // 1. Try Gemini LLM Generation if GEMINI_API_KEY is configured
    try {
      if (process.env.GEMINI_API_KEY && ProviderManager) {
        const prompt = `You are an expert AI Concept Architect. Extract EXACTLY 5 to 6 essential, sequential keywords or core points for the topic: "${cleanTopic}".

For each keyword point, provide:
1. step: Integer from 1 to 6
2. keyword: Short 2-3 word concept title (e.g., "Qubit Superposition")
3. subtitle: 2-4 word tag summary
4. description: A clear 1-2 sentence explanation of why this point is crucial.
5. imagePrompt: A vivid visual description suitable for image generation illustrating this concept.

Return ONLY valid JSON matching this schema:
{
  "topic": "${cleanTopic}",
  "summary": "1 sentence overview of the topic pipeline",
  "keywords": [
    {
      "step": 1,
      "keyword": "Concept Title",
      "subtitle": "Tagline",
      "description": "Important point explanation",
      "imagePrompt": "Detailed prompt for generating image"
    }
  ]
}`;

        const aiResult = await ProviderManager.generateStructuredResponse(prompt, {
          type: 'object',
          properties: {
            topic: { type: 'string' },
            summary: { type: 'string' },
            keywords: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  step: { type: 'number' },
                  keyword: { type: 'string' },
                  subtitle: { type: 'string' },
                  description: { type: 'string' },
                  imagePrompt: { type: 'string' }
                }
              }
            }
          }
        });

        if (aiResult?.keywords && aiResult.keywords.length >= 5) {
          const colorThemes = ['indigo', 'violet', 'sky', 'emerald', 'amber', 'rose'];

          const keywordsWithImages = aiResult.keywords.slice(0, 6).map((item, idx) => {
            const seed = (cleanTopic.length * 17) + (idx * 31);
            const promptSlug = encodeURIComponent(item.imagePrompt || `${cleanTopic} ${item.keyword} concept vector art 3d render`);
            const imageUrl = `https://image.pollinations.ai/prompt/${promptSlug}?width=500&height=350&nologo=true&seed=${seed}`;

            return {
              step: idx + 1,
              keyword: item.keyword,
              subtitle: item.subtitle || `Key Phase ${idx + 1}`,
              description: item.description,
              imagePrompt: item.imagePrompt,
              imageUrl,
              colorTheme: colorThemes[idx % colorThemes.length]
            };
          });

          return {
            topic: aiResult.topic || cleanTopic,
            summary: aiResult.summary || `5-6 Key Milestone Pipeline for ${cleanTopic}`,
            totalSteps: keywordsWithImages.length,
            keywords: keywordsWithImages
          };
        }
      }
    } catch (err) {
      console.warn('[OrchestratorService] LLM Pipeline generation fallback used:', err.message);
    }

    // 2. Built-in Dynamic Fallback Generator for Topic Pipeline (5-6 Keywords & Visual Cards)
    return orchestratorService.getFallbackTopicPipeline(cleanTopic);
  },

  /**
   * Resilient fallback keyword & image generator for popular & custom topics.
   */
  getFallbackTopicPipeline: (topic) => {
    const topicLower = topic.toLowerCase();
    const colorThemes = ['indigo', 'violet', 'sky', 'emerald', 'amber', 'rose'];

    let rawKeywords = [];

    if (topicLower.includes('quantum')) {
      rawKeywords = [
        {
          keyword: 'Qubit Superposition',
          subtitle: 'Dual State Physics',
          description: 'Qubits exist simultaneously in combinations of |0⟩ and |1⟩ until measured.',
          imagePrompt: 'Glowing quantum bit particle floating in superposition state with wave functions 3d render'
        },
        {
          keyword: 'Quantum Entanglement',
          subtitle: 'Interconnected States',
          description: 'Instantaneous correlation between entangled quantum pairs regardless of distance.',
          imagePrompt: 'Two entangled quantum nodes connected by glowing energy beam digital art'
        },
        {
          keyword: 'Quantum Gates',
          subtitle: 'Unitary Operations',
          description: 'Hadamard and CNOT gates manipulate qubit phases to perform quantum algorithms.',
          imagePrompt: 'Futuristic quantum gate circuit board glowing blue and cyan laser lines'
        },
        {
          keyword: 'Quantum Interference',
          subtitle: 'Probability Shaping',
          description: 'Constructive and destructive interference amplifies correct computational paths.',
          imagePrompt: 'Quantum wave interference pattern with vibrant cyan and violet light waves'
        },
        {
          keyword: 'Quantum Error Correction',
          subtitle: 'Decoherence Shielding',
          description: 'Surface codes protect logical qubits from thermal noise and decoherence errors.',
          imagePrompt: 'Digital shield matrix surrounding fragile quantum processor core glowing gold'
        },
        {
          keyword: 'Quantum Advantage',
          subtitle: 'Exponential Acceleration',
          description: 'Executing complex molecular simulations & optimization far beyond classical supercomputers.',
          imagePrompt: 'Futuristic quantum supercomputer tower glowing in dark data laboratory'
        }
      ];
    } else if (topicLower.includes('photosynthesis')) {
      rawKeywords = [
        {
          keyword: 'Photon Absorption',
          subtitle: 'Solar Energy Harvest',
          description: 'Chlorophyll pigments absorb red and blue light wavelengths inside thylakoid membranes.',
          imagePrompt: 'Sunlight photons hitting green plant leaf thylakoid membrane micro 3d render'
        },
        {
          keyword: 'Water Photolysis',
          subtitle: 'Oxygen Generation',
          description: 'Light energy splits H₂O molecules into electrons, protons, and byproduct oxygen gas.',
          imagePrompt: 'Water molecule splitting into hydrogen ions and oxygen bubbles glowing green'
        },
        {
          keyword: 'Electron Transport',
          subtitle: 'Proton Gradient',
          description: 'High-energy electrons move through Photosystem II & I to pump hydrogen ions.',
          imagePrompt: 'Microscopic electron transport chain in plant cell chloroplast digital diagram'
        },
        {
          keyword: 'ATP & NADPH Synthesis',
          subtitle: 'Chemical Storage',
          description: 'ATP Synthase converts proton motive force into stored chemical cellular energy.',
          imagePrompt: 'ATP synthase molecular motor rotating inside plant cell membrane render'
        },
        {
          keyword: 'Calvin Cycle',
          subtitle: 'Carbon Fixation',
          description: 'RuBisCO enzyme incorporates atmospheric CO₂ into 3-PGA organic carbon molecules.',
          imagePrompt: 'Cyclic chemical reaction converting carbon dioxide molecules into sugars green light'
        },
        {
          keyword: 'Glucose Production',
          subtitle: 'Biomass Synthesis',
          description: 'G3P molecules synthesize glucose sugar to nourish plant growth and terrestrial ecosystems.',
          imagePrompt: 'Glucose sugar crystal molecule glowing inside green plant cell background'
        }
      ];
    } else if (topicLower.includes('machine learning') || topicLower.includes('ml') || topicLower.includes('ai')) {
      rawKeywords = [
        {
          keyword: 'Data Ingestion',
          subtitle: 'Raw Stream Collection',
          description: 'Gathering structured and unstructured datasets from database streams and APIs.',
          imagePrompt: 'Digital data streams flowing into cloud data warehouse network diagram 3d render'
        },
        {
          keyword: 'Preprocessing & Cleaning',
          subtitle: 'Feature Engineering',
          description: 'Handling missing values, scaling features, and encoding categorical variables.',
          imagePrompt: 'Raw messy data filtering into clean organized glowing matrix grid illustration'
        },
        {
          keyword: 'Model Training',
          subtitle: 'Gradient Optimization',
          description: 'Neural networks adjust weights via backpropagation to minimize loss functions.',
          imagePrompt: 'Deep neural network nodes connecting and firing glowing synapses 3d digital art'
        },
        {
          keyword: 'Hyperparameter Tuning',
          subtitle: 'Validation Optimization',
          description: 'Searching learning rate and batch size parameters for maximum accuracy.',
          imagePrompt: 'Interactive futuristic control dashboard tuning glowing knobs and sliders'
        },
        {
          keyword: 'Model Evaluation',
          subtitle: 'Benchmark Metrics',
          description: 'Validating precision, recall, and F1-scores against unseen test datasets.',
          imagePrompt: 'Modern analytics dashboard displaying accuracy curves and confusion matrix'
        },
        {
          keyword: 'CI/CD MLOps Deployment',
          subtitle: 'Production Pipeline',
          description: 'Deploying containerized models to cloud endpoints with real-time latency monitoring.',
          imagePrompt: 'Cloud container server deploying neural net model into global microservices'
        }
      ];
    } else {
      // Generic Dynamic Generator for Any User Topic
      rawKeywords = [
        {
          keyword: `${topic} Foundations`,
          subtitle: 'Core Principles',
          description: `Establishing fundamental concepts, architecture, and scope for ${topic}.`,
          imagePrompt: `Abstract conceptual foundation diagram for ${topic} vibrant modern vector art`
        },
        {
          keyword: 'System Architecture',
          subtitle: 'Structural Design',
          description: `Structuring key components, relationships, and data flows within ${topic}.`,
          imagePrompt: `Futuristic architectural blueprint matrix glowing neon lines for ${topic}`
        },
        {
          keyword: 'Execution Mechanism',
          subtitle: 'Core Process',
          description: `Active operational workflow and processing dynamics of ${topic}.`,
          imagePrompt: `Dynamic process flow mechanism with glowing connected nodes for ${topic}`
        },
        {
          keyword: 'Optimization & Control',
          subtitle: 'Efficiency Tuning',
          description: `Refining parameters, throughput, and error handling mechanisms.`,
          imagePrompt: `Glowing control dashboard optimizing energy and throughput for ${topic}`
        },
        {
          keyword: 'Integration Layer',
          subtitle: 'Ecosystem Synergy',
          description: `Connecting ${topic} modules with external tools, APIs, and environments.`,
          imagePrompt: `Digital network mesh connecting modular nodes in cyberspace for ${topic}`
        },
        {
          keyword: 'Future Impact',
          subtitle: 'Scalability & Horizon',
          description: `Real-world application, expansion roadmap, and future domain evolution.`,
          imagePrompt: `Futuristic technological horizon with glowing light trails for ${topic}`
        }
      ];
    }

    const stepFallbacks = [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80'
    ];

    const keywords = rawKeywords.map((item, idx) => {
      const seed = Math.abs(topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 19 + idx * 43);
      const promptSlug = encodeURIComponent(item.imagePrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${promptSlug}?width=500&height=350&nologo=true&seed=${seed}`;
      const fallbackUrl = stepFallbacks[idx % stepFallbacks.length];

      return {
        step: idx + 1,
        keyword: item.keyword,
        subtitle: item.subtitle,
        description: item.description,
        imagePrompt: item.imagePrompt,
        imageUrl: imageUrl || fallbackUrl,
        fallbackUrl,
        colorTheme: colorThemes[idx % colorThemes.length]
      };
    });


    return {
      topic,
      summary: `6-Step Connected Visual Milestone Pipeline for "${topic}"`,
      totalSteps: keywords.length,
      keywords
    };
  },

  // Retain mock helper methods for backwards compatibility
  runPipeline: async (goal) => {
    return orchestratorService.generateTopicPipeline(goal);
  },
  getWorkflowsData: async () => [
    { id: 'wf-1', title: 'Quantum Computing Pipeline', intent: 'Concept Extraction', status: 'completed', duration: '1.2s' },
    { id: 'wf-2', title: 'Machine Learning Pipeline', intent: 'Process Mapping', status: 'completed', duration: '0.9s' }
  ],
  getHistoryData: async () => [],
  getContextData: async () => ({ activeTopic: 'Topic-to-Image Pipeline Orchestrator' }),
  getLogsData: async () => [],
  replayWorkflowCycle: async () => ({ success: true, message: 'Pipeline re-executed.' })
};

export default orchestratorService;
