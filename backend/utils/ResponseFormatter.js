class ResponseFormatter {
  /**
   * Format single resource response.
   */
  static formatSingle(resource, modelName = 'Resource') {
    return {
      type: modelName,
      attributes: resource,
      createdAt: resource?.createdAt || new Date(),
      updatedAt: resource?.updatedAt || new Date()
    };
  }

  /**
   * Format a list of resources.
   */
  static formatList(list, modelName = 'Resource') {
    return {
      type: `${modelName}List`,
      count: list.length,
      items: list.map(item => this.formatSingle(item, modelName))
    };
  }

  /**
   * Format custom payload.
   */
  static formatCustom(data) {
    return {
      timestamp: new Date(),
      ...data
    };
  }
}

export default ResponseFormatter;
