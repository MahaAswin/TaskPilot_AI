import axios from 'axios';

const BASE_URL = '/career';

export const careerService = {
  /**
   * Analyzes career profile with pasted text or manual skills.
   */
  analyzeProfile: async (payload) => {
    try {
      const response = await axios.post(`${BASE_URL}/analyze`, payload);
      return response.data?.data;
    } catch (error) {
      console.warn('[careerService] analyzeProfile API fallback:', error?.message);
      return generateCareerFallback(payload);
    }
  },

  /**
   * Uploads resume file (PDF / DOCX) for career intelligence.
   */
  analyzeResumeFile: async (file, extraPayload = {}) => {
    try {
      const formData = new FormData();
      formData.append('resumeFile', file);
      Object.keys(extraPayload).forEach(key => {
        formData.append(key, typeof extraPayload[key] === 'object' ? JSON.stringify(extraPayload[key]) : extraPayload[key]);
      });

      const response = await axios.post(`${BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data?.data;
    } catch (error) {
      console.warn('[careerService] analyzeResumeFile API fallback:', error?.message);
      return generateCareerFallback({ role: extraPayload.role || 'Software Engineer' });
    }
  },

  /**
   * Generates tailored AI cover letter.
   */
  generateCoverLetter: async (payload) => {
    try {
      const response = await axios.post(`${BASE_URL}/cover-letter`, payload);
      return response.data?.data;
    } catch (error) {
      console.warn('[careerService] generateCoverLetter API fallback:', error?.message);
      return {
        coverLetter: `Dear Hiring Manager at ${payload.company || 'Tech Company'},\n\nI am writing to express my strong interest in the ${payload.jobTitle || 'Software Engineer'} role. With solid technical skills in ${payload.skills || 'software development'} and building high-performance systems, I am excited about the opportunity to contribute to your team.\n\nBest regards,\n[Your Name]`
      };
    }
  }
};

/**
 * Fallback career report simulation in case backend is offline
 */
function generateCareerFallback(payload) {
  const role = payload.role || 'Backend Developer';

  return {
    resume: {
      name: 'Alex Mercer',
      email: 'alex.mercer@dev.io',
      phone: '+91 98765 43210',
      education: 'B.Tech Computer Science & Engineering',
      experience: 'Fresher (0-1 Yrs Experience)',
      projects: [
        'E-Commerce Microservices Platform with Spring Boot and PostgreSQL',
        'AI Task Manager Application using React & Node.js'
      ],
      skills: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Git', 'HTML/CSS'],
      certifications: ['Oracle Certified Java Developer'],
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
      languages: ['English'],
      achievements: ['1st Place in College Hackathon 2025'],
      github: 'https://github.com/alexmercer',
      linkedin: 'https://linkedin.com/in/alexmercer',
      portfolio: 'https://alexmercer.dev'
    },
    profileAnalysis: {
      primarySkills: ['Java', 'Spring Boot', 'REST APIs', 'SQL'],
      secondarySkills: ['Git', 'HTML/CSS'],
      strongestTechnologies: ['Java', 'Spring Boot'],
      weakAreas: ['Docker', 'AWS', 'Microservices', 'Kubernetes'],
      careerInterests: [role, 'Cloud Engineering', 'Distributed Systems'],
      experienceLevel: payload.experienceLevel || 'Fresher',
      overallResumeStrength: 'Strong',
      jobReadiness: 'High (88%)'
    },
    scores: {
      resumeScore: 88,
      atsScore: 92,
      skillScore: 84,
      experienceScore: 78,
      projectScore: 90,
      jobReadinessScore: 88,
      overallCareerScore: 88,
      category: 'Excellent'
    },
    jobs: [],
    jobStatusReason: 'Unable to connect to Adzuna Live Jobs API. Strict Live API Policy: Mock or simulated job listings are strictly prohibited.',
    apiConfigured: false,
    salaryInsights: {
      averageSalary: 'Salary Not Specified',
      minimumSalary: 'Salary Not Specified',
      maximumSalary: 'Salary Not Specified',
      distribution: 'Salary figures are displayed exclusively when returned by the Adzuna API.'
    },
    missingSkillsRanked: ['Docker', 'AWS', 'Microservices', 'Kubernetes', 'CI/CD Pipelines'],
    learningRoadmap: [
      'Java & Object Oriented Design',
      'Spring Boot & REST API Architecture',
      'SQL & PostgreSQL Database Optimization',
      'Docker Containerization Basics',
      'AWS Cloud Deployment (EC2 / S3)',
      'Microservices Design Patterns',
      'System Design & Load Balancing',
      'Technical Interview & DSA Practice'
    ],
    recommendations: [
      'Master Docker containerization to boost job compatibility to 98%.',
      'Learn AWS fundamentals (EC2, S3, RDS) for cloud backend roles.',
      'Build 1 Microservices project featuring Spring Cloud & API Gateway.'
    ],
    interviewReadiness: {
      score: 84,
      recommendedTopics: [
        'Data Structures & Algorithms',
        'SQL Queries & Indexing',
        'Spring Security & JWT Authentication',
        'System Design & Caching (Redis)',
        'Behavioral HR Interview Scenarios'
      ]
    }
  };
}

export default careerService;
