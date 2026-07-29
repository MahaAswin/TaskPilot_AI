/**
 * Data Transfer Object representing application preparation and submission response.
 */
export class ApplicationResponseDTO {
  constructor({
    emailSubject = '',
    emailBody = '',
    targetJob = null,
    matchPercentage = 85,
    matchedSkills = [],
    missingSkills = [],
    confidenceScore = 90,
    coverLetterPdfBase64 = null,
    coverLetterDocxBase64 = null,
    status = 'Prepared'
  }) {
    this.emailSubject = emailSubject;
    this.emailBody = emailBody;
    this.targetJob = targetJob;
    this.matchPercentage = matchPercentage;
    this.matchedSkills = matchedSkills;
    this.missingSkills = missingSkills;
    this.confidenceScore = confidenceScore;
    this.coverLetterPdfBase64 = coverLetterPdfBase64;
    this.coverLetterDocxBase64 = coverLetterDocxBase64;
    this.status = status;
  }
}

export default ApplicationResponseDTO;
