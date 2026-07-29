export class RoadmapService {
  /**
   * Generates step-by-step career learning roadmap.
   */
  static generateRoadmap(role = 'Backend Developer', existingSkills = [], missingSkills = []) {
    const basePaths = {
      'Backend Developer': ['Java / Python Fundamentals', 'Spring Boot / Express Framework', 'REST API Architecture & SQL', 'Docker Containerization', 'AWS Cloud Services', 'Microservices Architecture', 'System Design & Scalability', 'Mock Technical Interviews'],
      'Full Stack Developer': ['JavaScript & TypeScript', 'React / Next.js Frontend', 'Node.js Backend APIs', 'MongoDB / PostgreSQL', 'Docker Deployment', 'CI/CD Pipelines', 'Full Stack Project Build', 'Interview Prep'],
      'Software Engineer': ['Data Structures & Algorithms', 'Object Oriented Programming', 'Database Systems & SQL', 'Git & Software Lifecycle', 'System Design Basics', 'Operating Systems & Linux', 'Interview Preparation']
    };

    const roadmap = basePaths[role] || basePaths['Backend Developer'];
    const missingSkillsRanked = missingSkills.length > 0 ? missingSkills : ['Docker', 'AWS', 'Microservices', 'System Design', 'CI/CD'];

    return {
      roadmap,
      missingSkillsRanked
    };
  }
}

export default RoadmapService;
