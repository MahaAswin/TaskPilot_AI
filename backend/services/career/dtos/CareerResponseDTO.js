/**
 * Data Transfer Object representing complete AI Career Intelligence analysis.
 */
export class CareerResponseDTO {
  constructor({
    resume = {},
    profileAnalysis = {},
    scores = {},
    jobs = [],
    salaryInsights = {},
    missingSkillsRanked = [],
    learningRoadmap = [],
    recommendations = [],
    interviewReadiness = {}
  }) {
    this.resume = resume;
    this.profileAnalysis = profileAnalysis;
    this.scores = scores;
    this.jobs = jobs;
    this.salaryInsights = salaryInsights;
    this.missingSkillsRanked = missingSkillsRanked;
    this.learningRoadmap = learningRoadmap;
    this.recommendations = recommendations;
    this.interviewReadiness = interviewReadiness;
  }
}

export default CareerResponseDTO;
