// Token Estimator Module

export class TokenEstimator {
  static estimateTokens(text = '') {
    if (!text) return 0;
    // Basic heuristic: 1 token approx 4 characters
    return Math.ceil(text.length / 4);
  }
}

export default TokenEstimator;
