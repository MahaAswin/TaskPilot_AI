export class CareerScoreService {
  /**
   * Calculates comprehensive career scoring metrics.
   */
  static calculateScores(resume, skills = []) {
    const skillCount = skills.length;

    const resumeScore = Math.max(60, Math.min(95, 65 + (skillCount * 4) + (resume.projects?.length || 0) * 5));
    const atsScore = Math.max(65, Math.min(96, 70 + (resume.email !== 'Not Mentioned' ? 10 : 0) + (resume.github !== 'Not Mentioned' ? 10 : 0)));
    const skillScore = Math.max(55, Math.min(95, 50 + (skillCount * 6)));
    const experienceScore = /senior|mid/i.test(resume.experience) ? 88 : 72;
    const projectScore = (resume.projects?.length || 0) >= 2 ? 90 : 75;
    const jobReadinessScore = Math.round((skillScore + atsScore + projectScore) / 3);

    const overallScore = Math.round((resumeScore * 0.25) + (atsScore * 0.25) + (skillScore * 0.25) + (jobReadinessScore * 0.25));

    let category = 'Good';
    if (overallScore >= 88) category = 'Excellent';
    else if (overallScore >= 72) category = 'Good';
    else category = 'Needs Improvement';

    const interviewReadinessScore = Math.round((skillScore * 0.5) + (projectScore * 0.5));

    return {
      scores: {
        resumeScore,
        atsScore,
        skillScore,
        experienceScore,
        projectScore,
        jobReadinessScore,
        overallCareerScore: overallScore,
        category
      },
      interviewReadiness: {
        score: interviewReadinessScore,
        recommendedTopics: ['Data Structures & Algorithms', 'SQL & Database Optimization', 'REST API Architecture', 'System Design Fundamentals', 'Behavioral HR Questions']
      }
    };
  }
}

export default CareerScoreService;
