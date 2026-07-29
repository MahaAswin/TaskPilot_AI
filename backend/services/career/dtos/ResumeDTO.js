/**
 * Data Transfer Object representing parsed resume details.
 */
export class ResumeDTO {
  constructor({
    name = 'Not Mentioned',
    email = 'Not Mentioned',
    phone = 'Not Mentioned',
    education = 'Not Mentioned',
    experience = 'Not Mentioned',
    projects = [],
    skills = [],
    certifications = [],
    technologies = [],
    languages = [],
    achievements = [],
    github = 'Not Mentioned',
    linkedin = 'Not Mentioned',
    portfolio = 'Not Mentioned'
  }) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.education = education;
    this.experience = experience;
    this.projects = projects;
    this.skills = skills;
    this.certifications = certifications;
    this.technologies = technologies;
    this.languages = languages;
    this.achievements = achievements;
    this.github = github;
    this.linkedin = linkedin;
    this.portfolio = portfolio;
  }
}

export default ResumeDTO;
