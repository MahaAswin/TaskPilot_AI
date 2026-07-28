import agentRegistry from './AgentRegistry.js';
import llmService from '../services/llmService.js';

class CoordinatorAgent {
  /**
   * Run the Coordinator.
   * @param {string} prompt - User message prompt
   * @param {object} context - User context (user object, active tasks, etc.)
   * @param {function} onUpdate - Callback for streaming status: (type, data) => void
   */
  async run(prompt, context, onUpdate) {
    onUpdate('status', { 
      agent: 'CoordinatorAgent', 
      status: 'thinking', 
      message: 'Analyzing request intent...' 
    });

    // 1. Describe agents for LLM selection
    const agentDescriptions = agentRegistry.getAgentDescriptions();
    const systemPrompt = `You are the Coordinator Agent, the brain of the TaskPilot AI Multi-Agent Operating System.
Your job is to read the user request and decide which specialized agents are required to fulfill it.
You can select multiple agents if needed, but select ONLY the agents that are relevant to the user request.

Here are the available agents and their roles:
${agentDescriptions.map(a => `- ${a.name}: ${a.description}`).join('\n')}

You must respond ONLY with a valid JSON object matching this schema:
{
  "reasoning": "A concise explanation of why you chose these agents",
  "selectedAgents": ["PlannerAgent", "TaskAgent", "KnowledgeAgent", "CreativeAgent", "ProductivityCoachAgent"]
}
Do not include any Markdown wrapper, just return the raw JSON.`;

    let decision;
    try {
      const decisionText = await llmService.generateCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]);

      const cleanedText = decisionText.replace(/```json/g, '').replace(/```/g, '').trim();
      decision = JSON.parse(cleanedText);
    } catch (error) {
      console.error('[Coordinator Agent] Selection failed, falling back:', error);
      // Fallback selection based on query
      const lower = prompt.toLowerCase();
      let agents = [];
      if (lower.includes('task') || lower.includes('todo') || lower.includes('complete')) agents.push('TaskAgent');
      if (lower.includes('plan') || lower.includes('roadmap') || lower.includes('schedule')) agents.push('PlannerAgent');
      if (lower.includes('image') || lower.includes('draw') || lower.includes('diagram') || lower.includes('flowchart')) agents.push('CreativeAgent');
      if (lower.includes('score') || lower.includes('coach') || lower.includes('report')) agents.push('ProductivityCoachAgent');
      if (agents.length === 0) agents.push('KnowledgeAgent');
      
      decision = {
        reasoning: 'Fallback heuristic selected appropriate sub-agents.',
        selectedAgents: agents
      };
    }

    const selectedList = decision.selectedAgents || [];
    if (selectedList.length === 0) {
      selectedList.push('KnowledgeAgent');
    }

    onUpdate('status', { 
      agent: 'CoordinatorAgent', 
      status: 'completed', 
      message: `Selected agents: ${selectedList.join(', ')}. ${decision.reasoning}` 
    });

    const agentResponses = [];

    // 2. Execute selected agents in sequence (or parallel, but sequence is easier to track logs)
    for (const agentName of selectedList) {
      const agentInstance = agentRegistry.getAgent(agentName);
      if (!agentInstance) {
        continue;
      }

      const displayStatus = agentName === 'CreativeAgent' && (prompt.toLowerCase().includes('image') || prompt.toLowerCase().includes('draw')) 
        ? 'generating' 
        : 'working';
        
      const statusMessage = agentName === 'CreativeAgent' && (prompt.toLowerCase().includes('image') || prompt.toLowerCase().includes('draw')) 
        ? 'Generating image preview...' 
        : 'Running calculations...';

      onUpdate('status', { 
        agent: agentName, 
        status: displayStatus, 
        message: statusMessage 
      });

      try {
        const result = await agentInstance.run(prompt, context);
        onUpdate('status', { 
          agent: agentName, 
          status: 'completed', 
          message: 'Execution complete.' 
        });
        
        agentResponses.push({
          agentName,
          result
        });
      } catch (err) {
        onUpdate('status', { 
          agent: agentName, 
          status: 'failed', 
          message: `Execution failed: ${err.message}` 
        });
        agentResponses.push({
          agentName,
          result: `### ${agentName} Execution Error\n${err.message}`
        });
      }
    }

    // 3. Merge responses
    onUpdate('status', { 
      agent: 'CoordinatorAgent', 
      status: 'working', 
      message: 'Consolidating agent reports...' 
    });

    let consolidatedMarkdown = `## 🛸 Coordinator Dashboard\n\n> **Routing Decision:** ${decision.reasoning}\n\n`;

    for (const res of agentResponses) {
      consolidatedMarkdown += `\n${res.result}\n\n---\n`;
    }

    // Remove the trailing line
    if (consolidatedMarkdown.endsWith('\n\n---\n')) {
      consolidatedMarkdown = consolidatedMarkdown.slice(0, -6);
    }

    onUpdate('status', { 
      agent: 'CoordinatorAgent', 
      status: 'completed', 
      message: 'Co-Pilot execution consolidated successfully.' 
    });

    return {
      content: consolidatedMarkdown,
      agentTraces: selectedList.map(name => ({
        agentName: name,
        status: 'completed',
        message: 'Completed execution context.'
      }))
    };
  }
}

export default new CoordinatorAgent();
