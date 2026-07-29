import { BaseProvider } from './BaseProvider.js';

export class MockProvider extends BaseProvider {
  constructor(config = {}) {
    super({ name: 'MockProvider', model: 'mock-v1', ...config });
  }

  async generateText(prompt, options = {}) {
    const rawText = String(prompt || '');
    let userPrompt = rawText;
    if (rawText.includes('[USER PROMPT]')) {
      userPrompt = rawText.split('[USER PROMPT]')[1].trim();
    }

    const cleanPrompt = userPrompt.toLowerCase().trim();

    // Default Question 1: What is programming
    if (cleanPrompt.includes('programming') && (cleanPrompt.includes('what is') || cleanPrompt.includes('explain') || cleanPrompt.includes('define') || cleanPrompt === 'programming')) {
      return `Programming is the process of writing instructions that tell a computer what to do. These instructions are written in programming languages such as Python, Java, C++, or JavaScript.

For example:

If you want a calculator app, programming tells the computer how to add, subtract, multiply, and divide numbers.
If you want a game, programming tells the computer how characters move, score points, and respond to player actions.

In simple terms:

Programming is creating a set of step-by-step instructions for a computer to perform specific tasks.`;
    }

    // Default Question 2: What is API
    if (cleanPrompt.includes('api') && (cleanPrompt.includes('what is') || cleanPrompt.includes('explain') || cleanPrompt.includes('define') || cleanPrompt === 'api' || cleanPrompt.includes('application programming interface'))) {
      return `API (Application Programming Interface) is a way for two software applications to communicate with each other.
It allows one application to request data or services from another application.
An API receives the request, processes it, and returns a response.
It acts as a bridge between the client and the server.
Example: A weather app uses an API to get live weather data from a weather server.`;
    }

    return `### Answer for "${userPrompt}"\n\nTaskPilot AI Assistant response:\n\n- **Overview**: Explanation and structured breakdown for "${userPrompt}".\n- **Key Principles**: Essential concepts, architecture, and step-by-step guidance.\n- **Application**: Practical implementation guidelines for your project.`;
  }

  async generateStructuredResponse(prompt, schema = {}, options = {}) {
    return { mock: true, prompt, schema };
  }

  async generateImage(prompt, options = {}) {
    return {
      error: 'Image generation is not yet supported by the configured provider.',
      message: 'Image generation is not yet supported by the configured provider.'
    };
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
    return `[Summary]: ${text.slice(0, 100)}...`;
  }

  async explain(topic, options = {}) {
    return this.generateText(`explain ${topic}`, options);
  }

  async explainTopic(topic, options = {}) {
    return this.generateText(topic, options);
  }

  async generateNotes(topic, options = {}) {
    return this.generateText(topic, options);
  }

  async generateStudyPlan(topic, options = {}) {
    return { topic, duration: '4 Weeks', weeklyPlan: [{ week: 1, title: 'Foundations', goals: ['Learn basics'], dailyHours: 2 }] };
  }

  async generateRoadmap(goal, options = {}) {
    const planText = `# 📌 AI-Generated Roadmap: ${goal}

## 🎯 Goal Overview
Your goal is to achieve: "${goal}". Based on your configured schedule and intensity, here is a structured execution plan.

---

## 🗺️ Phase 1 — Foundations & Prerequisites (Week 1-2)
- Understand core fundamentals and set up your learning environment
- Study key theoretical concepts with 2-3 hours of daily focused sessions
- Complete beginner-level exercises and note any weak areas
- **Milestone**: Pass a self-assessment quiz on foundational topics

## 🚀 Phase 2 — Core Implementation (Week 3-4)
- Dive into intermediate topics, building real-world mini-projects
- Solve 2-3 practice problems per day, focusing on pattern recognition
- Begin a project portfolio showcasing key skills learned
- **Milestone**: Complete one functional project and document it

## 🏆 Phase 3 — Advanced Practice & Mastery (Week 5-6)
- Tackle advanced concepts, mock tests, and full-scale project builds
- Focus on weak spots identified during Phase 1
- Review and revise notes; participate in peer reviews
- **Milestone**: Complete a capstone project or mock assessment

---

## 📅 Daily Schedule Template
| Time Slot       | Activity                          |
|-----------------|-----------------------------------|
| 08:00 - 09:00  | Review previous day's notes       |
| 09:00 - 11:00  | New topic deep-dive               |
| 11:00 - 12:00  | Hands-on coding / exercises       |
| 14:00 - 15:30  | Practice problems / mock tests    |
| 20:00 - 21:00  | Evening revision & flashcards     |

---

## ✅ Recommended Resources
- Video Courses: YouTube Channels (freeCodeCamp, Traversy Media)
- Books: "Clean Code" by Robert Martin; "The Pragmatic Programmer"
- Practice Platforms: LeetCode, HackerRank, CodeForces
- Community: Stack Overflow, Reddit communities, Discord study groups

---

*Generated by TaskPilot AI Planner Agent. Adapt this roadmap according to your pace.*`;

    return {
      goal,
      response: planText,
      milestones: [
        { step: 1, title: 'Foundations & Prerequisites', description: `Master core concepts for: ${goal}`, estimatedDays: 14, recommendedResources: ['freeCodeCamp', 'YouTube tutorials'] },
        { step: 2, title: 'Core Implementation', description: 'Build intermediate modules and complete practice exercises', estimatedDays: 14, recommendedResources: ['LeetCode', 'HackerRank'] },
        { step: 3, title: 'Advanced Practice & Mastery', description: 'Deploy capstone projects and execute mock assessments', estimatedDays: 14, recommendedResources: ['GitHub Portfolio', 'Mock Interview Platforms'] }
      ]
    };
  }

  async generateTasks(goal, options = {}) {
    return [{ title: `Task for ${goal}`, category: 'Learning', priority: 'High', estimatedMinutes: 30, xpReward: 20 }];
  }

  async generateInterviewQuestions(topic, options = {}) {
    return [{ question: `What is ${topic}?`, difficulty: 'Medium', modelAnswer: `${topic} is...`, keyKeywords: [topic] }];
  }

  async generateMermaidDiagram(topic, options = {}) {
    return `graph TD;\n  A[${topic}] --> B[Core Concepts];\n  B --> C[Applications];`;
  }

  async generateMindMapJSON(topic, options = {}) {
    return { id: 'root', label: topic, children: [{ id: 'sub-1', label: 'Core Concepts', children: [] }] };
  }

  async chat(messages = [], options = {}) {
    const lastMsg = messages[messages.length - 1]?.content || 'Hello';
    return this.generateText(lastMsg, options);
  }
}

export default MockProvider;
