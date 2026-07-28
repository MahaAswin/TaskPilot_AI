// OpenAPI / Swagger Documentation Specification Helper

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TaskPilot AI API Documentation',
    version: '1.0.0',
    description: 'Enterprise REST API endpoints for TaskPilot AI Agentic Operating System'
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local Development Server'
    }
  ],
  paths: {
    '/health': {
      get: {
        summary: 'System Health Check Endpoint',
        responses: {
          200: {
            description: 'System is healthy and operational'
          }
        }
      }
    }
  }
};

export default swaggerSpec;
