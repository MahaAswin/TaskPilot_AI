export class SkillAnalysisService {
  /**
   * Analyzes profile skills, weak areas, and job readiness.
   */
  static analyze(skills = [], role = 'Backend Developer', experienceText = '') {
    const primarySkills = skills.slice(0, 4);
    const secondarySkills = skills.slice(4);

    // Determine weak areas based on target role requirements
    const roleRequirements = {
      'Backend Developer': ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Docker', 'AWS', 'Microservices', 'Redis'],
      'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'MongoDB', 'REST APIs', 'Docker', 'Tailwind'],
      'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'Git', 'SQL', 'Linux'],
      'AI Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Vector DB', 'REST APIs', 'Docker']
    };

    const targetList = roleRequirements[role] || roleRequirements['Backend Developer'];
    const weakAreas = targetList.filter(req => !skills.some(s => s.toLowerCase() === req.toLowerCase()));

    // Experience classification
    let level = 'Fresher';
    if (/senior|5\+|6\+/i.test(experienceText)) level = 'Senior';
    else if (/mid|3\+|4\+/i.test(experienceText)) level = 'Mid Level';
    else if (/1\+|2\+|junior/i.test(experienceText)) level = 'Junior';

    const resumeStrength = skills.length >= 6 ? 'Strong' : skills.length >= 3 ? 'Moderate' : 'Basic';
    const jobReadiness = skills.length >= 5 ? 'High (88%)' : 'Intermediate (65%)';

    return {
      primarySkills: primarySkills.length > 0 ? primarySkills : ['Programming Basics'],
      secondarySkills,
      strongestTechnologies: primarySkills,
      weakAreas: weakAreas.length > 0 ? weakAreas : ['Advanced Cloud Architecture'],
      careerInterests: [role, 'Cloud Engineering', 'System Architecture'],
      experienceLevel: level,
      overallResumeStrength: resumeStrength,
      jobReadiness
    };
  }
}

export default SkillAnalysisService;
