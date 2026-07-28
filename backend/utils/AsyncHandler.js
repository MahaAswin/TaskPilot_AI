/**
   * Reusable Async Handler wrapper for Express route callbacks.
   * Catches errors and forwards them to the global error middleware.
   * @param {Function} requestHandler - Route controller logic
   * @returns {Function} Express route execution middleware
   */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
export { asyncHandler };
