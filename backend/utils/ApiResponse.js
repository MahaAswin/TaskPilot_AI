class ApiResponse {
  /**
   * Represents a unified API success response.
   * @param {number} statusCode - HTTP status code
   * @param {any} data - Data payload to return
   * @param {string} message - User friendly message
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(res, data = null, message = 'Operation successful', statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  static created(res, data = null, message = 'Resource created', statusCode = 201) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }
}

export default ApiResponse;
