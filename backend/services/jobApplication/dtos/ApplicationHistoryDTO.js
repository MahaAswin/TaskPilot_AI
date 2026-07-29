/**
 * Data Transfer Object representing recorded job application submission.
 */
export class ApplicationHistoryDTO {
  constructor({
    id = `APP-${Date.now()}`,
    company = '',
    role = '',
    hrEmail = '',
    appliedDate = new Date().toISOString(),
    status = 'Submitted',
    subject = '',
    attachments = [],
    matchPercentage = 85,
    messageId = '',
    deliveryStatus = 'Delivered'
  }) {
    this.id = id;
    this.company = company;
    this.role = role;
    this.hrEmail = hrEmail;
    this.appliedDate = appliedDate;
    this.status = status;
    this.subject = subject;
    this.attachments = attachments;
    this.matchPercentage = matchPercentage;
    this.messageId = messageId || `<msg-${Date.now()}@taskpilot.ai>`;
    this.deliveryStatus = deliveryStatus;
  }
}

export default ApplicationHistoryDTO;
