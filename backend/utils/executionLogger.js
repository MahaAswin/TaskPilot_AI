// Execution Logger Utility

export const logExecutionEvent = (agent, message, level = 'INFO') => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[Orchestrator ${timestamp}] [${level}] [${agent}]: ${message}`);
  return { timestamp, agent, level, message };
};

export default {
  logExecutionEvent
};
