/**
 * Data Transfer Object representing normalized job listings.
 */
export class JobDTO {
  constructor({
    id = '',
    title = '',
    company = '',
    location = 'Remote',
    salaryMin = null,
    salaryMax = null,
    salaryDisplay = 'Not Specified',
    description = '',
    employmentType = 'Full Time',
    redirectUrl = '#',
    companyLogo = '',
    matchPercentage = 85,
    matchedSkills = [],
    missingSkills = [],
    matchReason = ''
  }) {
    this.id = id;
    this.title = title;
    this.company = company;
    this.location = location;
    this.salaryMin = salaryMin;
    this.salaryMax = salaryMax;
    this.salaryDisplay = salaryDisplay;
    this.description = description;
    this.employmentType = employmentType;
    this.redirectUrl = redirectUrl;
    this.companyLogo = companyLogo;
    this.matchPercentage = matchPercentage;
    this.matchedSkills = matchedSkills;
    this.missingSkills = missingSkills;
    this.matchReason = matchReason;
  }
}

export default JobDTO;
