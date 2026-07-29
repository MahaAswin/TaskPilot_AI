/**
 * Data Transfer Object representing candidate job application input.
 */
export class ApplicationDTO {
  constructor({
    fullName = '',
    email = '',
    phone = '',
    resumeText = '',
    resumeFileName = '',
    coverLetterText = '',
    portfolioUrl = '',
    githubUrl = '',
    linkedinUrl = '',
    preferredRole = '',
    preferredLocation = '',
    additionalNotes = '',
    targetJob = null
  }) {
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.resumeText = resumeText;
    this.resumeFileName = resumeFileName;
    this.coverLetterText = coverLetterText;
    this.portfolioUrl = portfolioUrl;
    this.githubUrl = githubUrl;
    this.linkedinUrl = linkedinUrl;
    this.preferredRole = preferredRole;
    this.preferredLocation = preferredLocation;
    this.additionalNotes = additionalNotes;
    this.targetJob = targetJob;
  }
}

export default ApplicationDTO;
