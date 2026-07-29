import ApplicationHistoryDTO from './dtos/ApplicationHistoryDTO.js';

// In-memory application history store
const historyStore = [
  new ApplicationHistoryDTO({
    id: 'APP-1001',
    company: 'TechCorp Global',
    role: 'Senior Software Engineer',
    hrEmail: 'careers@techcorpglobal.com',
    appliedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Submitted',
    subject: 'Application for Senior Software Engineer Position - TaskPilot Candidate',
    attachments: ['Resume_SoftwareEngineer.pdf', 'CoverLetter_TechCorp.pdf'],
    matchPercentage: 92
  }),
  new ApplicationHistoryDTO({
    id: 'APP-1002',
    company: 'InnovateAI Labs',
    role: 'Full Stack AI Developer',
    hrEmail: 'hr@innovateai.io',
    appliedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'Under Review',
    subject: 'Job Application: Full Stack AI Developer - Candidate Profile',
    attachments: ['Resume_FullStackAI.pdf', 'CoverLetter_InnovateAI.pdf'],
    matchPercentage: 88
  })
];

export class ApplicationHistoryService {
  /**
   * Records a new job application submission.
   * @param {Object} appData 
   * @returns {ApplicationHistoryDTO}
   */
  static recordApplication(appData) {
    const record = new ApplicationHistoryDTO({
      id: `APP-${Date.now().toString().slice(-6)}`,
      company: appData.company || 'Target Company',
      role: appData.role || 'Job Role',
      hrEmail: appData.hrEmail || 'hr@company.com',
      appliedDate: new Date().toISOString(),
      status: 'Submitted',
      subject: appData.subject || `Job Application for ${appData.role}`,
      attachments: appData.attachments || ['Resume.pdf', 'CoverLetter.pdf'],
      matchPercentage: appData.matchPercentage || 85
    });

    historyStore.unshift(record);
    return record;
  }

  /**
   * Retrieves all recorded job applications with optional status and search filtering.
   * @param {Object} query 
   * @returns {Array<ApplicationHistoryDTO>}
   */
  static getHistory(query = {}) {
    const { status, search } = query;
    let results = [...historyStore];

    if (status && status !== 'all') {
      results = results.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      results = results.filter(item => 
        item.company.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.hrEmail.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }

    return results;
  }
}

export default ApplicationHistoryService;
