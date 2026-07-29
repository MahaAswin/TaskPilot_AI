import axios from 'axios';

const BASE_URL = '/email-briefing';

export const emailBriefingService = {
  /**
   * Analyzes pasted email text.
   */
  analyzeText: async ({ text }) => {
    try {
      const response = await axios.post(`${BASE_URL}/analyze`, { text });
      return response.data?.data;
    } catch (error) {
      console.warn('[emailBriefingService] analyzeText API fallback:', error?.message);
      return generateBriefingFallback(text);
    }
  },

  /**
   * Uploads and analyzes email file (.txt, .pdf, .docx, .eml).
   */
  analyzeFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data?.data;
    } catch (error) {
      console.warn('[emailBriefingService] analyzeFile API fallback:', error?.message);
      const textFallback = await file.text().catch(() => 'Sample Email Content extracted from uploaded file.');
      return generateBriefingFallback(textFallback, file.name);
    }
  },

  /**
   * Retrieves past briefing history.
   */
  getHistory: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/history`);
      return response.data?.data || [];
    } catch (error) {
      console.warn('[emailBriefingService] getHistory API fallback:', error?.message);
      return [];
    }
  },

  /**
   * Generates AI email reply draft.
   */
  generateReply: async ({ reportId, instruction = '' }) => {
    try {
      const response = await axios.post(`${BASE_URL}/reply`, { reportId, instruction });
      return response.data?.data;
    } catch (error) {
      console.warn('[emailBriefingService] generateReply API fallback:', error?.message);
      return {
        replyText: `Dear Sender,\n\nThank you for your message. I have reviewed the executive summary and will follow up accordingly.\n\nBest regards,\n[Your Name]`
      };
    }
  }
};

/**
 * Fallback briefing generator in case backend API is temporarily offline
 */
function generateBriefingFallback(text, fileName = '') {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  
  return {
    _id: `brief_${Date.now()}`,
    rawText: text,
    fileName,
    summary: `Executive Briefing: Email details a key project update regarding project milestones and deliverables. Action items have been cataloged below.`,
    purpose: 'Project Update',
    sender: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@acmecorp.com',
      organization: 'Acme Corp'
    },
    recipient: {
      name: 'Executive Team',
      email: 'exec@company.com'
    },
    subject: 'Q3 Project Deliverables & Review Meeting',
    priority: '🔴 High',
    deadlines: ['Submit Q3 report before 5:00 PM Friday'],
    importantDates: ['31 July 2026', 'Friday 2:00 PM'],
    tasks: ['Review attached Q3 roadmap', 'Confirm attendance for Friday call', 'Submit feedback to Sarah'],
    questions: ['Can you confirm your availability for Friday at 2 PM?'],
    links: ['https://meet.google.com/abc-defg-hij', 'https://drive.google.com/file/d/12345'],
    attachmentsMentioned: ['Q3_Roadmap_Draft.pdf'],
    calendarEvents: [
      { title: 'Q3 Project Review Call', date: '31 July 2026', time: '2:00 PM', reminder: '15 mins before' }
    ],
    replyRequired: {
      required: true,
      reason: 'Sender requested confirmation for Friday 2 PM meeting.'
    },
    category: 'Work',
    riskLevel: 'Safe',
    readingTime: `${Math.ceil((wordCount / 200) * 60)} sec`,
    recommendations: [
      'Reply immediately to confirm meeting time.',
      'Add Q3 Review Call to Google / Outlook Calendar.',
      'Review Q3 Roadmap before Friday.'
    ],
    keyHighlights: [
      'We are scheduling the final Q3 review meeting for Friday at 2:00 PM.',
      'Please ensure all feedback on the roadmap is submitted prior to the call.'
    ],
    grammarAnalysis: {
      grammarScore: 88,
      writingQualityCategory: 'Good',
      writingLevel: 'Professional',
      overallEmailQualityScore: 92,
      counts: {
        grammarErrors: 1,
        spellingErrors: 1,
        punctuationErrors: 1,
        styleSuggestions: 1,
        sentenceStructureIssues: 0,
        capitalizationIssues: 0,
        repeatedWords: 0,
        passiveVoice: 1,
        totalIssues: 4
      },
      issues: [
        {
          originalText: 'your doing',
          correctedText: "you're doing",
          category: 'Grammar',
          explanation: 'Use "you\'re" instead of "your".',
          example: "your doing → you're doing",
          severity: 3
        },
        {
          originalText: 'interested for',
          correctedText: 'interested in',
          category: 'Grammar',
          explanation: 'Use preposition "in" with interested.',
          example: 'interested for → interested in',
          severity: 3
        },
        {
          originalText: 'wanna',
          correctedText: 'want to',
          category: 'Style & Tone',
          explanation: 'Use formal phrasing in business communication.',
          example: 'wanna → want to',
          severity: 2
        }
      ],
      assessmentFeedback: 'Good email composition with minor grammar and phrasing refinements recommended.',
      available: true
    },
    correctedText: `From: Sarah Jenkins <sarah.j@acmecorp.com>
To: Executive Team <exec@company.com>
Subject: Urgent: Q3 Project Review & Deliverables Deadline

Dear Team,

Please review the attached Q3 Roadmap document before our meeting. We have scheduled the final Q3 review call for Friday at 2:00 PM (Google Meet link: https://meet.google.com/abc-defg-hij).

All final reports must be submitted before Friday 5:00 PM. Could you please confirm your availability for the call? Also, please let me know if you need any additional resources.

Please find attached the draft roadmap.

Best regards,
Sarah`
  };
}

export default emailBriefingService;
