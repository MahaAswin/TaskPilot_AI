import ResumeParserService from './ResumeParserService.js';
import SkillAnalysisService from './SkillAnalysisService.js';
import AdzunaClient from './AdzunaClient.js';
import adzunaConfig from '../../config/AdzunaConfig.js';
import JobMatchingService from './JobMatchingService.js';
import CareerScoreService from './CareerScoreService.js';
import RoadmapService from './RoadmapService.js';
import CareerResponseDTO from './dtos/CareerResponseDTO.js';

export class CareerService {
  /**
   * Main entry point to generate comprehensive career intelligence report.
   */
  static async analyzeCareerProfile({
    resumeText = '',
    file = null,
    manualSkills = [],
    role = 'Backend Developer',
    location = 'Remote',
    experienceLevel = 'Fresher',
    employmentType = 'Full Time'
  }) {
    let rawText = resumeText || '';
    if (file) {
      rawText = file.buffer ? file.buffer.toString('utf-8') : '';
    }

    // 1. Parse Resume
    const parsedResume = ResumeParserService.parse(rawText);

    // Merge manual skills if provided
    const combinedSkills = Array.from(new Set([...parsedResume.skills, ...manualSkills]));
    if (combinedSkills.length === 0) {
      combinedSkills.push('Java', 'REST APIs', 'SQL', 'Git');
    }

    // 2. Perform AI Skill Analysis
    const profileAnalysis = SkillAnalysisService.analyze(combinedSkills, role, experienceLevel);

    // 3. Search Active Jobs via Adzuna API (Using adzunaConfig dependency injection)
    const adzunaResult = await AdzunaClient.searchJobs(adzunaConfig, {
      role,
      skills: combinedSkills,
      location
    });

    const rawJobs = adzunaResult.jobs || [];
    const jobStatusReason = adzunaResult.reason || '';

    // 4. Perform Job Compatibility Matching
    const matchedJobs = JobMatchingService.matchJobs(rawJobs, combinedSkills, role);

    // 5. Calculate Career & ATS Scores
    const { scores, interviewReadiness } = CareerScoreService.calculateScores(parsedResume, combinedSkills);

    // 6. Generate Roadmap & Ranked Missing Skills
    const { roadmap, missingSkillsRanked } = RoadmapService.generateRoadmap(role, combinedSkills, profileAnalysis.weakAreas);

    // 7. Calculate Salary Distribution Insights
    const salaries = matchedJobs.map(j => j.salaryMin).filter(Boolean);
    const salaryInsights = {
      averageSalary: salaries.length > 0 ? `₹${Math.round((salaries.reduce((a, b) => a + b, 0) / salaries.length) / 100000)}L / yr` : 'Not Specified',
      minimumSalary: salaries.length > 0 ? `₹${Math.round(Math.min(...salaries) / 100000)}L / yr` : 'Not Specified',
      maximumSalary: salaries.length > 0 ? `₹${Math.round(Math.max(...salaries) / 100000)}L / yr` : 'Not Specified',
      distribution: 'Competitive market rate based on active job listings.'
    };

    // 8. Generate Personalized AI Recommendations
    const recommendations = [
      `Strengthen core ${role} fundamentals by building 1 production-grade project.`,
      `Improve hands-on knowledge in missing skills: ${missingSkillsRanked.slice(0, 3).join(', ')}.`,
      `Optimize resume formatting to increase your ATS Score from ${scores.atsScore}% to 95%+.`
    ];

    return new CareerResponseDTO({
      resume: parsedResume,
      profileAnalysis,
      scores,
      jobs: matchedJobs,
      jobStatusReason,
      apiConfigured: adzunaConfig.isConfigured(),
      salaryInsights,
      missingSkillsRanked,
      learningRoadmap: roadmap,
      recommendations,
      interviewReadiness
    });
  }

  /**
   * Generates tailored AI Cover Letter.
   */
  static async generateCoverLetter(jobTitle = 'Software Engineer', company = 'Tech Company', userProfile = {}) {
    const prompt = `Write a professional, compelling cover letter for the position of ${jobTitle} at ${company}.
Skills: ${userProfile.skills?.join(', ') || 'Software Development, REST APIs'}
Experience: ${userProfile.experience || 'Entry Level'}
Highlight enthusiasm, problem solving, and key project contributions.`;

    try {
      const result = await aiService.chat([{ role: 'user', content: prompt }]);
      return { coverLetter: result.response };
    } catch (e) {
      return {
        coverLetter: `Dear Hiring Manager at ${company},\n\nI am writing to express my strong interest in the ${jobTitle} position. With solid expertise in software development and building scalable applications, I am eager to contribute to your engineering team.\n\nThank you for considering my application.\n\nSincerely,\n[Your Name]`
      };
    }
  }
}

export default CareerService;
