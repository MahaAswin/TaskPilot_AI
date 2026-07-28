/**
 * Reusable HTTP Request Logger Middleware.
 */
export const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[HTTP Access Log] [${timestamp}] - ${method} ${url} - IP: ${ip}`);
  next();
};

export default loggerMiddleware;
