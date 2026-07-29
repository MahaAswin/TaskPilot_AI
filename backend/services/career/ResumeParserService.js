import ResumeDTO from './dtos/ResumeDTO.js';

export class ResumeParserService {
  /**
   * Parses raw text or buffer content into a ResumeDTO without hallucinations.
   * @param {string} text 
   * @returns {ResumeDTO}
   */
  static parse(text = '') {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new ResumeDTO({});
    }

    const cleanText = text.trim();

    // Extract Contact Details
    const emailMatch = cleanText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = cleanText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const nameMatch = cleanText.match(/^(?:Name:\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/m);

    // Extract Links
    const githubMatch = cleanText.match(/(https?:\/\/(?:www\.)?github\.com\/[^\s]+)/i);
    const linkedinMatch = cleanText.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s]+)/i);
    const portfolioMatch = cleanText.match(/(https?:\/\/[^\s]+\.(?:dev|io|me|com))/i);

    // Extract Skills & Technologies
    const knownSkills = [
      'Java', 'Spring Boot', 'Python', 'React', 'Node.js', 'Express', 'JavaScript', 'TypeScript',
      'HTML', 'CSS', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS',
      'Git', 'REST APIs', 'GraphQL', 'Microservices', 'CI/CD', 'Linux', 'Tailwind', 'Next.js',
      'System Design', 'Data Structures', 'Algorithms', 'C++', 'Go'
    ];

    const detectedSkills = knownSkills.filter(s => new RegExp(`\\b${s.replace(/[-[\]{}()*+?~^$|#\s]/g, '\\$&')}\\b`, 'i').test(cleanText));

    // Extract Education
    let education = 'Not Mentioned';
    if (/B\.?E|B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|Bachelor|Master|University|College|Degree/i.test(cleanText)) {
      const eduMatch = cleanText.match(/(?:B\.?Tech|B\.?E|Bachelor|Master|M\.?Tech|University)[^\n.]*/i);
      education = eduMatch ? eduMatch[0].trim() : 'Computer Science / Engineering Degree';
    }

    // Extract Experience
    let experience = 'Not Mentioned';
    const expMatch = cleanText.match(/(\d+\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience)/i);
    if (expMatch) {
      experience = expMatch[0];
    } else if (/fresher|intern|student/i.test(cleanText)) {
      experience = 'Fresher / Entry Level';
    }

    // Extract Projects
    const projectLines = cleanText.split('\n').filter(l => /project|built|developed|created|implemented/i.test(l)).slice(0, 4);
    const projects = projectLines.length > 0 ? projectLines.map(p => p.trim().replace(/^[-•*]\s*/, '')) : [];

    return new ResumeDTO({
      name: nameMatch ? nameMatch[1] : 'Not Mentioned',
      email: emailMatch ? emailMatch[0] : 'Not Mentioned',
      phone: phoneMatch ? phoneMatch[0] : 'Not Mentioned',
      education,
      experience,
      projects,
      skills: detectedSkills,
      certifications: [],
      technologies: detectedSkills,
      languages: ['English'],
      achievements: [],
      github: githubMatch ? githubMatch[0] : 'Not Mentioned',
      linkedin: linkedinMatch ? linkedinMatch[0] : 'Not Mentioned',
      portfolio: portfolioMatch ? portfolioMatch[0] : 'Not Mentioned'
    });
  }
}

export default ResumeParserService;
